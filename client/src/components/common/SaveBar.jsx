import "./SaveBar.css";

function SaveBar({
  dirty = false,
  saving = false,
  onSave,
  onReset,
  savedLabel = "All changes saved",
}) {
  return (
    <div className="save-bar">
      <div className="save-bar-status">
        <span
          className={dirty ? "save-bar-dot dirty" : "save-bar-dot"}
        />
        {dirty ? "You have unsaved changes" : savedLabel}
      </div>

      <div className="save-bar-actions">
        {onReset && (
          <button
            type="button"
            className="save-bar-btn reset"
            onClick={onReset}
            disabled={saving || !dirty}
          >
            Reset
          </button>
        )}

        <button
          type="button"
          className="save-bar-btn save"
          onClick={onSave}
          disabled={saving || !dirty}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

export default SaveBar;