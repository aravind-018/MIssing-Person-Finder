import "./SettingInput.css";

function SettingInput({
  label,
  description,
  type = "text",
  name,
  value,
  onChange,
  placeholder = "",
  min,
  max,
  step,
  suffix,
  disabled = false,
}) {
  return (
    <div className="setting-field">
      <label className="setting-field-label">{label}</label>

      {description && (
        <p className="setting-field-description">{description}</p>
      )}

      <div className="setting-field-control">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
        />

        {suffix && (
          <span className="setting-field-suffix">{suffix}</span>
        )}
      </div>
    </div>
  );
}

export default SettingInput;