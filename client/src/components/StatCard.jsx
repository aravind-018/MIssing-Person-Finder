function StatCard({ title, value, color }) {
  return (
    <div
      style={{
        background: "#1E293B",
        borderRadius: "15px",
        padding: "25px",
        width: "250px",
        color: "white",
        borderLeft: `6px solid ${color}`,
        boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
      }}
    >
      <h3 style={{ color: "#94A3B8", marginBottom: "10px" }}>
        {title}
      </h3>

      <h1 style={{ fontSize: "40px" }}>
        {value}
      </h1>
    </div>
  );
}

export default StatCard;