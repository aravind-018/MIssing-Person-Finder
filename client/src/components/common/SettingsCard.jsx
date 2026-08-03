import "./SettingsCard.css";

function SettingsCard({ icon, title, description, actions, children }) {
  return (
    <div className="settings-card">
      <div className="settings-card-header">
        <div className="settings-card-heading">
          {icon && <span className="settings-card-icon">{icon}</span>}

          <div>
            <h2>{title}</h2>
            {description && <p>{description}</p>}
          </div>
        </div>

        {actions && (
          <div className="settings-card-actions">{actions}</div>
        )}
      </div>

      <div className="settings-card-body">{children}</div>
    </div>
  );
}

export default SettingsCard;