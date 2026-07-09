import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";

function Dashboard() {
  return (
    <div
      style={{
        display: "flex",
        background: "#0F172A",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <Sidebar />

      <div style={{ flex: 1, padding: "40px" }}>
        <h1>Dashboard</h1>

        <p style={{ color: "#94A3B8", marginBottom: "30px" }}>
          Welcome to GodsEye
        </p>

        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <StatCard
            title="Missing Persons"
            value="0"
            color="#3B82F6"
          />

          <StatCard
            title="Videos Processed"
            value="0"
            color="#22C55E"
          />

          <StatCard
            title="Matches Found"
            value="0"
            color="#EF4444"
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;