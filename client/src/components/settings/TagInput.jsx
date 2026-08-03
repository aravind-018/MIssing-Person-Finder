import { useState } from "react";

function TagInput({
  label,
  description,
  placeholder,
  value = [],
  onChange,
  buttonText = "Add",
}) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const tag = input.trim();

    if (!tag) return;

    if (value.includes(tag)) {
      setInput("");
      return;
    }

    onChange([...value, tag]);
    setInput("");
  };

  const removeTag = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="setting-field">
      <label className="setting-field-label">{label}</label>

      {description && (
        <p className="setting-field-description">{description}</p>
      )}

      <div className="tag-input-row">
        <input
          type="text"
          value={input}
          placeholder={placeholder}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
        />

        <button
          type="button"
          className="settings-add-btn"
          onClick={addTag}
        >
          {buttonText}
        </button>
      </div>

      {value.length > 0 && (
        <div className="tag-list">
          {value.map((item, index) => (
            <div
              className="tag-chip"
              key={`${item}-${index}`}
            >
              {item}

              <button
                type="button"
                onClick={() => removeTag(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TagInput;