function FormInput({
  label,
  icon,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
}) {
  return (
    <div className="input-group">
      <label>{label}</label>

      <div className="input-box">
        <div className="input-icon">
          {icon}
        </div>

        <input
  name={name}
  type={type}
  placeholder={placeholder}
  value={value}
  onChange={onChange}
/>

      </div>
    </div>
  );
}

export default FormInput;