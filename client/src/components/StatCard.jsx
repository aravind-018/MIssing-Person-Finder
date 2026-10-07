function StatCard({ title, value, color }) {
  return (
    <div
      style={{
        background: "var(--bg-surface, #1E293B)",
        borderRadius: "15px",
        padding: "25px",
        width: "250px",
        color: "var(--text-primary, white)",
        borderLeft: `6px solid ${color}`,
        boxShadow: "var(--shadow-md, 0 5px 15px rgba(0,0,0,0.3))",
      }}
    >
      <h3 style={{ color: "var(--text-muted, #94A3B8)", marginBottom: "10px" }}>
        {title}
      </h3>

      <h1 style={{ fontSize: "40px" }}>
        {value}
      </h1>
    </div>
  );
}

export default StatCard;