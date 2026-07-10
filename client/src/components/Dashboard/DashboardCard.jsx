import "./DashboardCard.css";

function DashboardCard({ title, value, color, icon }) {
  return (
    <div
      className="dashboard-card"
      style={{ borderTop: `5px solid ${color}` }}
    >
      <div className="card-header">
        <span className="card-icon">{icon}</span>
        <h4>{title}</h4>
      </div>

      <h2>{value}</h2>
    </div>
  );
}

export default DashboardCard;