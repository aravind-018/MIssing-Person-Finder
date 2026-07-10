import { useEffect, useState } from "react";
import DashboardCard from "../components/dashboard/DashboardCard";
import { getAllPersons } from "../services/personService";
import "../styles/Dashboard.css";
import RecentCases from "../components/dashboard/RecentCases";
import QuickActions from "../components/dashboard/QuickActions";
import DashboardCharts from "../components/dashboard/DashboardCharts";  
import {
  FaClipboardList,
  FaExclamationTriangle,
  FaCheckCircle,
  FaCalendarAlt,
} from "react-icons/fa";

function Dashboard() {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    loadPersons();
  }, []);

  async function loadPersons() {
    try {
      setPersons(await getAllPersons());
    } catch (err) {
      console.error(err);
    }
  }

  const total = persons.length;
  const missing = persons.filter((p) => p.status === "Missing").length;
  const found = persons.filter((p) => p.status === "Found").length;
  const recentPersons = [...persons]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 5);

const cards = [
  {
    title: "Total Cases",
    value: total,
    color: "#4F46E5",
    icon: <FaClipboardList />,
  },
  {
    title: "Missing",
    value: missing,
    color: "#EF4444",
    icon: <FaExclamationTriangle />,
  },
  {
    title: "Found",
    value: found,
    color: "#10B981",
    icon: <FaCheckCircle />,
  },
  {
    title: "This Month",
    value: 0,
    color: "#F59E0B",
    icon: <FaCalendarAlt />,
  },
];
  return (
  <div className="dashboard-container">
    <h1 className="dashboard-title">Dashboard</h1>

    <div className="dashboard-grid">
      {cards.map((card) => (
      <DashboardCard
  key={card.title}
  title={card.title}
  value={card.value}
  color={card.color}
  icon={card.icon}
/>
      ))}
    </div>

    <div className="dashboard-bottom">
  <RecentCases persons={recentPersons} />
  <QuickActions />
  <section className="analytics-section">
  <h2 className="section-title">Analytics</h2>

  <DashboardCharts persons={persons} />
</section>
</div>
  </div>
);
}

export default Dashboard;