import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import logo from "../../assets/logo.png";
import "./PatrolLogo.css";

/**
 * ============================================================================
 * PatrolLogo — Autonomous "GodsEye" surveillance drone
 * ============================================================================
 *
 * Continuous, curved, never-teleporting patrol around the viewport with a
 * periodic scan cycle (fly to a corner near the login card, hover, rotate to
 * face the card, sweep it with a searchlight, then fly off and resume).
 *
 * Everything is driven by a single requestAnimationFrame loop (Framer
 * Motion's useAnimationFrame) writing straight into refs + motion values —
 * no nested timers, no per-frame React re-renders, no stale closures.
 *
 * STATE MACHINE
 * --------------
 *   PATROL       -> wanders the viewport, steers around the card & edges
 *   MOVE_TO_SCAN -> flies to a randomly chosen corner around the card
 *   HOVER        -> stops, hovers ~800ms, gradually rotates to face the card
 *   SCAN         -> searchlight + card scan-line play out, then...
 *   LEAVE        -> flies to a fresh patrol point, then back to PATROL
 *
 * INTEGRATION (matches your current project as-is)
 * ---------------------------------------------------
 * - Finds the card via `cardSelector` (default "#login-card" — matches your
 *   <div id="login-card" className="login-card">). No changes to Login.jsx.
 * - Toggles the class "scan" on that element during the scan (same class
 *   your Login.css already styles via `.login-card.scan`). See the Login.css
 *   addition for the one extra line needed.
 * - Renders your real logo.png at ~30% opacity, 180px, no shadow/glow.
 * - Renders via a portal into <body>, so it always covers the viewport
 *   regardless of .login-page's `overflow:hidden`.
 */

// ---------------------------------------------------------------------------
// Tunables
// ---------------------------------------------------------------------------

const DRONE_SIZE = 180; // px — per spec
const DRONE_OPACITY = 0.3; // per spec
const BEAM_HEIGHT = 170; // px, max width of the searchlight cone

const MARGIN = 60; // keep-out margin from viewport edges
const CARD_PADDING = 70; // patrol keeps this far from the card's edge
const CORNER_OFFSET = 130; // how far a "scan corner" sits from the card corner
const REPEL_RADIUS = 90; // soft-avoidance falloff distance around the card

const MAX_SPEED_PATROL = 0.055; // px/ms
const MAX_SPEED_TRAVEL = 0.11; // px/ms (MOVE_TO_SCAN / LEAVE)

const STEER_TC_PATROL = 900; // ms, velocity smoothing time-constant
const STEER_TC_TRAVEL = 550;

const ROTATE_TC_PATROL = 1300; // ms, rotation smoothing time-constant
const ROTATE_TC_TRAVEL = 850;
const ROTATE_TC_HOVER = 520;

const WANDER_JITTER = 0.0022; // rad/ms drift rate of the wander heading

const HOVER_MS = 800;
const SCAN_MS = 2600;
const SCAN_FADE_MS = 320;
const SCAN_MIN_INTERVAL = 20000;
const SCAN_MAX_INTERVAL = 30000;
const MOVE_FAILSAFE_MS = 7000;
const LEAVE_MS = 2400;

const ARRIVE_RADIUS = 10;
const SLOWING_RADIUS = 150;

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const lerp = (a, b, t) => a + (b - a) * t;
const randomRange = (min, max) => min + Math.random() * (max - min);
const angleDeg = (dx, dy) => (Math.atan2(dy, dx) * 180) / Math.PI;

function lerpAngleDeg(a, b, t) {
  const diff = ((((b - a) % 360) + 540) % 360) - 180;
  return a + diff * t;
}

function expandRect(rect, pad) {
  return {
    left: rect.left - pad,
    top: rect.top - pad,
    right: rect.right + pad,
    bottom: rect.bottom + pad,
    width: rect.width + pad * 2,
    height: rect.height + pad * 2,
  };
}

function isInsideRect(rect, x, y) {
  return x > rect.left && x < rect.right && y > rect.top && y < rect.bottom;
}

function nearestPointOnRect(rect, x, y) {
  return { x: clamp(x, rect.left, rect.right), y: clamp(y, rect.top, rect.bottom) };
}

function computeCardAvoidance(pos, card) {
  const padded = expandRect(card, CARD_PADDING);

  if (isInsideRect(padded, pos.x, pos.y)) {
    const cx = padded.left + padded.width / 2;
    const cy = padded.top + padded.height / 2;
    const dx = pos.x - cx;
    const dy = pos.y - cy;
    const len = Math.hypot(dx, dy) || 1;
    return { x: dx / len, y: dy / len };
  }

  const near = nearestPointOnRect(padded, pos.x, pos.y);
  const dx = pos.x - near.x;
  const dy = pos.y - near.y;
  const dist = Math.hypot(dx, dy);

  if (dist < REPEL_RADIUS) {
    const strength = (REPEL_RADIUS - dist) / REPEL_RADIUS;
    const len = dist || 1;
    return { x: (dx / len) * strength, y: (dy / len) * strength };
  }

  return { x: 0, y: 0 };
}

function computeBoundsAvoidance(pos, vw, vh) {
  let x = 0;
  let y = 0;
  if (pos.x < MARGIN) x += (MARGIN - pos.x) / MARGIN;
  else if (pos.x > vw - MARGIN) x -= (pos.x - (vw - MARGIN)) / MARGIN;
  if (pos.y < MARGIN) y += (MARGIN - pos.y) / MARGIN;
  else if (pos.y > vh - MARGIN) y -= (pos.y - (vh - MARGIN)) / MARGIN;
  return { x, y };
}

function pickCornerIndex(lastIndex) {
  const pool = [0, 1, 2, 3].filter((i) => i !== lastIndex);
  return pool[Math.floor(Math.random() * pool.length)];
}

function cornerPoint(idx, card, vw, vh) {
  const pts = [
    { x: card.left - CORNER_OFFSET, y: card.top - CORNER_OFFSET }, // top-left
    { x: card.right + CORNER_OFFSET, y: card.top - CORNER_OFFSET }, // top-right
    { x: card.right + CORNER_OFFSET, y: card.bottom + CORNER_OFFSET }, // bottom-right
    { x: card.left - CORNER_OFFSET, y: card.bottom + CORNER_OFFSET }, // bottom-left
  ];
  const p = pts[idx];
  return { x: clamp(p.x, MARGIN, vw - MARGIN), y: clamp(p.y, MARGIN, vh - MARGIN) };
}

function randomPatrolPoint(card) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const padded = expandRect(card, CARD_PADDING);
  for (let i = 0; i < 12; i += 1) {
    const x = randomRange(MARGIN, vw - MARGIN);
    const y = randomRange(MARGIN, vh - MARGIN);
    if (!isInsideRect(padded, x, y)) return { x, y };
  }
  return { x: MARGIN, y: MARGIN };
}

function fallbackCardRect(vw, vh) {
  const width = Math.min(420, vw * 0.88);
  const height = Math.min(520, vh * 0.82);
  const left = (vw - width) / 2;
  const top = (vh - height) / 2;
  return { left, top, right: left + width, bottom: top + height, width, height };
}

function rectFromEl(el) {
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
}

function readCardRadius(el) {
  try {
    return getComputedStyle(el).borderRadius || "0px";
  } catch {
    return "0px";
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PatrolLogo({
  cardSelector = "#login-card",
  scanClassName = "scan",
  logoSrc = logo,
}) {
  // -- motion values (drive visuals directly, no re-renders) ----------------
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const mvRotate = useMotionValue(0);

  const mvBeamOpacity = useMotionValue(0);
  const mvBeamAngle = useMotionValue(0);
  const mvBeamLength = useMotionValue("0px");

  const mvCardTop = useMotionValue("0px");
  const mvCardLeft = useMotionValue("0px");
  const mvCardWidth = useMotionValue("0px");
  const mvCardHeight = useMotionValue("0px");
  const mvCardRadius = useMotionValue("16px");
  const mvScanOpacity = useMotionValue(0);
  const mvScanLineTop = useMotionValue("0%");

  // -- simulation refs --------------------------------------------------------
  const stateRef = useRef("PATROL");
  const posRef = useRef(null);
  const velRef = useRef(null);
  const rotationRef = useRef(0);
  const wanderAngleRef = useRef(0);

  const nextScanAtRef = useRef(null);
  const lastCornerIndexRef = useRef(-1);
  const scanTargetRef = useRef({ x: 0, y: 0 });
  const leaveTargetRef = useRef({ x: 0, y: 0 });

  const moveStartRef = useRef(0);
  const hoverStartRef = useRef(0);
  const scanStartRef = useRef(0);
  const leaveStartRef = useRef(0);

  const cardElRef = useRef(null);
  const warnedRef = useRef(false);
  const appliedScanClassRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const parkedRef = useRef(false);

  // Lazy one-time init (avoids an extra mount effect + render just to seed refs)
  if (posRef.current === null) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const angle = Math.random() * Math.PI * 2;
    wanderAngleRef.current = angle;
    posRef.current = {
      x: clamp(vw * 0.15 + Math.random() * vw * 0.2, MARGIN, vw - MARGIN),
      y: clamp(vh * 0.15 + Math.random() * vh * 0.2, MARGIN, vh - MARGIN),
    };
    velRef.current = {
      x: Math.cos(angle) * MAX_SPEED_PATROL,
      y: Math.sin(angle) * MAX_SPEED_PATROL,
    };
    rotationRef.current = (angle * 180) / Math.PI;
  }
  if (nextScanAtRef.current === null) {
    nextScanAtRef.current = performance.now() + randomRange(SCAN_MIN_INTERVAL, SCAN_MAX_INTERVAL);
  }

  // -- reduced motion + cleanup -----------------------------------------------
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mq.matches;
    const handler = (e) => {
      reducedMotionRef.current = e.matches;
    };
    mq.addEventListener("change", handler);
    return () => {
      mq.removeEventListener("change", handler);
      cardElRef.current?.classList.remove(scanClassName);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -- DOM lookup for the login card ------------------------------------------
  const ensureCardEl = () => {
    if (!cardElRef.current || !cardElRef.current.isConnected) {
      const found = document.querySelector(cardSelector);
      cardElRef.current = found;
      if (found) {
        mvCardRadius.set(readCardRadius(found));
      } else if (!warnedRef.current) {
        warnedRef.current = true;
        // Login card not found — will use centered fallback area silently in production
      }
    }
    return cardElRef.current;
  };

  // -- low-level motion helpers -------------------------------------------------
  const steerVelocity = (desiredVX, desiredVY, dt, tc) => {
    const k = 1 - Math.exp(-dt / tc);
    velRef.current.x = lerp(velRef.current.x, desiredVX, k);
    velRef.current.y = lerp(velRef.current.y, desiredVY, k);
  };

  const integratePosition = (dt) => {
    posRef.current.x += velRef.current.x * dt;
    posRef.current.y += velRef.current.y * dt;
  };

  const updateRotation = (mode, dt, card) => {
    let target;
    let tc;
    if (mode === "lookCenter") {
      const cx = card.left + card.width / 2;
      const cy = card.top + card.height / 2;
      target = angleDeg(cx - posRef.current.x, cy - posRef.current.y);
      tc = ROTATE_TC_HOVER;
    } else {
      const speed = Math.hypot(velRef.current.x, velRef.current.y);
      if (speed < 0.003) return;
      target = angleDeg(velRef.current.x, velRef.current.y);
      tc = mode === "travel" ? ROTATE_TC_TRAVEL : ROTATE_TC_PATROL;
    }
    const k = 1 - Math.exp(-dt / tc);
    rotationRef.current = lerpAngleDeg(rotationRef.current, target, k);
  };

  // -- state step functions ------------------------------------------------------
  const beginMoveToScan = (time, card, vw, vh) => {
    const idx = pickCornerIndex(lastCornerIndexRef.current);
    lastCornerIndexRef.current = idx;
    scanTargetRef.current = cornerPoint(idx, card, vw, vh);
    moveStartRef.current = time;
    stateRef.current = "MOVE_TO_SCAN";
  };

  const stepPatrol = (dt, time, card, vw, vh) => {
    if (time >= nextScanAtRef.current) {
      beginMoveToScan(time, card, vw, vh);
      return;
    }
    wanderAngleRef.current += (Math.random() - 0.5) * WANDER_JITTER * dt;
    const wander = { x: Math.cos(wanderAngleRef.current), y: Math.sin(wanderAngleRef.current) };
    const avoidCard = computeCardAvoidance(posRef.current, card);
    const avoidBounds = computeBoundsAvoidance(posRef.current, vw, vh);

    let dx = wander.x + avoidCard.x * 1.5 + avoidBounds.x * 2;
    let dy = wander.y + avoidCard.y * 1.5 + avoidBounds.y * 2;
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;

    steerVelocity(dx * MAX_SPEED_PATROL, dy * MAX_SPEED_PATROL, dt, STEER_TC_PATROL);
    integratePosition(dt);
    updateRotation("patrol", dt, card);
  };

  const stepMoveToScan = (dt, time, card, vw, vh) => {
    const target = scanTargetRef.current;
    const dx = target.x - posRef.current.x;
    const dy = target.y - posRef.current.y;
    const dist = Math.hypot(dx, dy);
    const failsafe = time - moveStartRef.current > MOVE_FAILSAFE_MS;

    if (dist < ARRIVE_RADIUS || failsafe) {
      hoverStartRef.current = time;
      stateRef.current = "HOVER";
      return;
    }

    const dirX = dx / (dist || 1);
    const dirY = dy / (dist || 1);
    const speedScale = clamp(dist / SLOWING_RADIUS, 0.15, 1);
    const avoidBounds = computeBoundsAvoidance(posRef.current, vw, vh);
    const avoidCard = computeCardAvoidance(posRef.current, card);

    steerVelocity(
      dirX * MAX_SPEED_TRAVEL * speedScale + avoidBounds.x * 0.02 + avoidCard.x * 0.02,
      dirY * MAX_SPEED_TRAVEL * speedScale + avoidBounds.y * 0.02 + avoidCard.y * 0.02,
      dt,
      STEER_TC_TRAVEL
    );
    integratePosition(dt);
    updateRotation("travel", dt, card);
  };

  const stepHover = (dt, time, card) => {
    steerVelocity(0, 0, dt, STEER_TC_TRAVEL);
    integratePosition(dt);
    updateRotation("lookCenter", dt, card);
    if (time - hoverStartRef.current >= HOVER_MS) {
      scanStartRef.current = time;
      stateRef.current = "SCAN";
    }
  };

  const endScanAndLeave = (time, card) => {
    ensureCardEl()?.classList.remove(scanClassName);
    appliedScanClassRef.current = false;
    mvBeamOpacity.set(0);
    mvScanOpacity.set(0);
    leaveTargetRef.current = randomPatrolPoint(card);
    leaveStartRef.current = time;
    stateRef.current = "LEAVE";
  };

  const stepScan = (dt, time, card) => {
    steerVelocity(0, 0, dt, STEER_TC_TRAVEL);
    integratePosition(dt);
    updateRotation("lookCenter", dt, card);

    if (!appliedScanClassRef.current) {
      ensureCardEl()?.classList.add(scanClassName);
      appliedScanClassRef.current = true;
    }

    const elapsed = time - scanStartRef.current;
    let op;
    if (elapsed < SCAN_FADE_MS) op = elapsed / SCAN_FADE_MS;
    else if (elapsed > SCAN_MS - SCAN_FADE_MS) op = (SCAN_MS - elapsed) / SCAN_FADE_MS;
    else op = 1;
    op = clamp(op, 0, 1);

    const cx = card.left + card.width / 2;
    const cy = card.top + card.height / 2;
    const baseAngle = angleDeg(cx - posRef.current.x, cy - posRef.current.y);
    const sweep = op > 0.15 ? Math.sin(time / 420) * 3 : 0;

    mvBeamAngle.set(baseAngle + sweep);
    mvBeamOpacity.set(op * 0.85);
    mvBeamLength.set(`${Math.hypot(cx - posRef.current.x, cy - posRef.current.y) + 30}px`);
    mvScanOpacity.set(op);
    mvScanLineTop.set(`${clamp(elapsed / SCAN_MS, 0, 1) * 100}%`);

    if (elapsed >= SCAN_MS) endScanAndLeave(time, card);
  };

  const stepLeave = (dt, time, card, vw, vh) => {
    const target = leaveTargetRef.current;
    const dx = target.x - posRef.current.x;
    const dy = target.y - posRef.current.y;
    const dist = Math.hypot(dx, dy);
    const timedOut = time - leaveStartRef.current > LEAVE_MS;

    if (dist < ARRIVE_RADIUS * 2 || timedOut) {
      stateRef.current = "PATROL";
      wanderAngleRef.current = Math.atan2(velRef.current.y, velRef.current.x);
      nextScanAtRef.current = time + randomRange(SCAN_MIN_INTERVAL, SCAN_MAX_INTERVAL);
      return;
    }

    const dirX = dx / (dist || 1);
    const dirY = dy / (dist || 1);
    const avoidBounds = computeBoundsAvoidance(posRef.current, vw, vh);

    steerVelocity(
      dirX * MAX_SPEED_TRAVEL + avoidBounds.x * 0.02,
      dirY * MAX_SPEED_TRAVEL + avoidBounds.y * 0.02,
      dt,
      STEER_TC_TRAVEL
    );
    integratePosition(dt);
    updateRotation("travel", dt, card);
  };

  // -- main loop -----------------------------------------------------------------
  useAnimationFrame((time, delta) => {
    if (reducedMotionRef.current) {
      if (!parkedRef.current) {
        parkedRef.current = true;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        mvX.set(vw - 140);
        mvY.set(vh - 140);
        mvRotate.set(0);
        mvBeamOpacity.set(0);
        mvScanOpacity.set(0);
      }
      return;
    }

    const dt = Math.min(delta || 16, 48);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const el = ensureCardEl();
    const card = el ? rectFromEl(el) : fallbackCardRect(vw, vh);

    switch (stateRef.current) {
      case "PATROL":
        stepPatrol(dt, time, card, vw, vh);
        break;
      case "MOVE_TO_SCAN":
        stepMoveToScan(dt, time, card, vw, vh);
        break;
      case "HOVER":
        stepHover(dt, time, card);
        break;
      case "SCAN":
        stepScan(dt, time, card);
        break;
      case "LEAVE":
        stepLeave(dt, time, card, vw, vh);
        break;
      default:
        break;
    }

    mvX.set(posRef.current.x);
    mvY.set(posRef.current.y);
    mvRotate.set(rotationRef.current);

    mvCardTop.set(`${card.top}px`);
    mvCardLeft.set(`${card.left}px`);
    mvCardWidth.set(`${card.width}px`);
    mvCardHeight.set(`${card.height}px`);
  });

  // -- render -----------------------------------------------------------------
  const content = (
    <div className="ge-patrol-root" aria-hidden="true">
      <motion.div
        className="ge-searchlight"
        style={{
          x: mvX,
          y: mvY,
          rotate: mvBeamAngle,
          width: mvBeamLength,
          opacity: mvBeamOpacity,
          "--ge-beam-height": `${BEAM_HEIGHT}px`,
        }}
      />

      <motion.div
        className="ge-scan-overlay"
        style={{
          top: mvCardTop,
          left: mvCardLeft,
          width: mvCardWidth,
          height: mvCardHeight,
          borderRadius: mvCardRadius,
          opacity: mvScanOpacity,
        }}
      >
        <motion.div className="ge-scan-line" style={{ top: mvScanLineTop }} />
      </motion.div>

      <motion.div
        className="ge-drone"
        style={{
          x: mvX,
          y: mvY,
          rotate: mvRotate,
          opacity: DRONE_OPACITY,
          "--ge-drone-size": `${DRONE_SIZE}px`,
        }}
      >
        <img src={logoSrc} alt="GodsEye Patrol" className="ge-drone-img" draggable="false" />
      </motion.div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(content, document.body) : null;
}