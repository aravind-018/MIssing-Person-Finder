import "./ToggleSwitch.css";

function ToggleSwitch({
  label,
  description,
  checked,
  onChange,
  name,
  disabled = false,
}) {
  return (
    <div className="toggle-row">
      <div className="toggle-text">
        <label className="toggle-label">{label}</label>

        {description && (
          <p className="toggle-description">{description}</p>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={checked ? "toggle-switch on" : "toggle-switch"}
        onClick={() =>
          !disabled && onChange({ target: { name, checked: !checked } })
        }
      >
        <span className="toggle-knob" />
      </button>
    </div>
  );
}

export default ToggleSwitch;