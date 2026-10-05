import "./SettingSection.css";

function SettingSection({ title, description, children }) {
  return (
    <div className="setting-section">
      {title && (
        <div className="setting-section-header">
          <h3>{title}</h3>

          {description && <p>{description}</p>}
        </div>
      )}

      <div className="setting-section-body">{children}</div>
    </div>
  );
}

export default SettingSection;