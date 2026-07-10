import { FaUserPlus, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./QuickActions.css";

function QuickActions() {
  const navigate = useNavigate();

  const actions = [
  {
    title: "Register Person",
    icon: <FaUserPlus />,
    path: "/register",
  },
  {
    title: "Manage Persons",
    icon: <FaUsers />,
    path: "/manage-persons",
  },
];

  return (
    <div className="quick-actions">
      <h2>Quick Actions</h2>

      {actions.map((action) => (
        <div
          key={action.title}
          className="action-card"
          onClick={() => navigate(action.path)}
        >
          <span className="action-icon">{action.icon}</span>

          <span>{action.title}</span>
        </div>
      ))}
    </div>
  );
}

export default QuickActions;