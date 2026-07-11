import { useNavigate } from "react-router-dom";
import "./QuickActions.css";

function QuickActions({ actions }) {
  const navigate = useNavigate();

  return (
    <div className="quick-actions">
      <h2>Quick Actions</h2>

      {actions.map((action) => (
        <div
          key={action.title}
          className="action-card"
          onClick={() => navigate(action.path)}
        >
          <span className="action-icon">
            {action.icon}
          </span>

          <span>{action.title}</span>
        </div>
      ))}
    </div>
  );
}

export default QuickActions;