import { useEffect, useState } from "react";
import {
  FaClipboardList,
  FaExclamationTriangle,
  FaCheckCircle,
  FaCalendarAlt,
  FaUserPlus,
  FaUsers,
} from "react-icons/fa";

import DashboardCard from "../../components/Dashboard/DashboardCard";
import QuickActions from "../../components/Dashboard/QuickActions";
import RecentCases from "../../components/Dashboard/RecentCases";
import { getAllPersons } from "../../services/personService";

import "../../styles/Dashboard.css";

function OfficerDashboard() {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    loadPersons();
  }, []);

  async function loadPersons() {
    try {
      setPersons(await getAllPersons());
    } catch (err) {
      // Error handled silently; UI remains unchanged for user
    }
  }

  const total = persons.length;
  const missing = persons.filter(
    (p) => p.status === "Missing"
  ).length;

  const found = persons.filter(
    (p) => p.status === "Found"
  ).length;

  const recentPersons = [...persons]
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
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

  const quickActions = [
    {
      title: "Register Missing Person",
      icon: <FaUserPlus />,
      path: "/officer/register",
    },
    {
      title: "Manage Missing Persons",
      icon: <FaUsers />,
      path: "/officer/manage-persons",
    },
  ];

  return (
    <div className="dashboard-container">
      <h2 className="page-title">
        Officer Dashboard
      </h2>

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
        <RecentCases
          persons={recentPersons}
          detailsPath="/officer/person"
        />

        <QuickActions actions={quickActions} />
      </div>
    </div>
  );
}

export default OfficerDashboard;