function OfficerStatCard({
  title,
  value,
  color,
}) {
  return (
    <div
      className="officer-stat-card"
      style={{
        borderTop: `4px solid ${color}`,
      }}
    >
      <h4>{title}</h4>

      <h2>{value}</h2>
    </div>
  );
}

export default OfficerStatCard;