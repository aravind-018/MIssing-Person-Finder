import "./SettingInput.css";

function SettingSelect({
  label,
  description,
  name,
  value,
  onChange,
  options = [],
  disabled = false,
}) {
  return (
    <div className="setting-field">
      <label className="setting-field-label">{label}</label>

      {description && (
        <p className="setting-field-description">{description}</p>
      )}

      <div className="setting-field-control">
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default SettingSelect;