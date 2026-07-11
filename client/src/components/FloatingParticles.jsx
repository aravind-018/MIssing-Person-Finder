import "./FloatingParticles.css";

const particles = Array.from({ length: 120 }, () => ({
  left: Math.random() * 100,
  size: 1 + Math.random() * 6,
  duration: 8 + Math.random() * 8,
  delay: Math.random() * 8,
}));

function FloatingParticles() {
  return (
    <div className="particles">
      {particles.map((p, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default FloatingParticles;