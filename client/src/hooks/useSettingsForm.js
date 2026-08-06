import { useEffect, useState, useCallback } from "react";
import { getSettings } from "../services/settingsService";
import { showSuccess, showError } from "../utils/toast";

/*
  Shared load/edit/dirty-check/save lifecycle for a single settings
  section (general / ai / camera / notifications / security / backup).
  Keeps GeneralSettings.jsx, AISettings.jsx etc. focused on their fields
  instead of repeating the same fetch + save plumbing.
*/
function useSettingsForm(section, updateFn) {
  const [form, setForm] = useState(null);
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const settings = await getSettings();

        if (!mounted) return;

        setForm(settings[section]);
        setInitial(settings[section]);
      } catch (error) {
        // Error handled for the user; avoid developer console output in production
        showError("Failed to load settings.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [section]);

  const handleChange = (e) => {
  const { name, value, checked, type } = e.target;

  let fieldValue;

  switch (type) {
    case "checkbox":
      fieldValue = checked;
      break;

    case "number":
      fieldValue = value === "" ? "" : Number(value);
      break;

    default:
      // Support custom ToggleSwitch (it doesn't provide type="checkbox")
      fieldValue =
        type === undefined && typeof checked === "boolean"
          ? checked
          : value;
  }

  setForm((prev) => ({
    ...prev,
    [name]: fieldValue,
  }));
};
  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => setForm(initial);

  const handleSave = useCallback(async () => {
    setSaving(true);

    try {
      const res = await updateFn(form);
      const updatedSection = res.settings ? res.settings[section] : form;

      setInitial(updatedSection);
      setForm(updatedSection);

      showSuccess(res.message || "Settings saved successfully.");
    } catch (error) {
      // Error handled for the user; avoid developer console output in production
      showError(error.response?.data?.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, section, updateFn]);

  const dirty =
    !!form && !!initial && JSON.stringify(form) !== JSON.stringify(initial);

  return {
    form,
    loading,
    saving,
    dirty,
    handleChange,
    setField,
    handleReset,
    handleSave,
  };
}

export default useSettingsForm;