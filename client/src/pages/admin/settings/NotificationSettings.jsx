import { FaBell } from "react-icons/fa";

import LoadingSpinner from "../../../components/common/LoadingSpinner";
import SettingsCard from "../../../components/common/SettingsCard";
import SaveBar from "../../../components/common/SaveBar";

import SettingSection from "../../../components/settings/SettingSection";
import SettingInput from "../../../components/settings/SettingInput";
import ToggleSwitch from "../../../components/settings/ToggleSwitch";

import useSettingsForm from "../../../hooks/useSettingsForm";
import { updateNotificationSettings } from "../../../services/settingsService";

function NotificationSettings() {
  const {
    form,
    loading,
    saving,
    dirty,
    handleChange,
    handleReset,
    handleSave,
  } = useSettingsForm(
    "notifications",
    updateNotificationSettings
  );

  if (loading || !form) {
    return (
      <LoadingSpinner text="Loading Notification Settings..." />
    );
  }

  return (
    <>
      <SettingsCard
        icon={<FaBell />}
        title="Notification Settings"
        description="Configure how GodsEye notifies administrators and officers."
      >
        <SettingSection
          title="Email Configuration"
          description="Choose which events should generate email notifications."
        >
          <SettingInput
            label="Alert Email"
            description="Email address that receives system notifications."
            type="email"
            name="alertEmail"
            value={form.alertEmail}
            onChange={handleChange}
            placeholder="admin@example.com"
          />

          <ToggleSwitch
            label="Enable Email Alerts"
            description="Master switch for all email notifications."
            name="emailAlertsEnabled"
            checked={form.emailAlertsEnabled}
            onChange={handleChange}
          />

          <ToggleSwitch
            label="Match Alerts"
            description="Notify when the AI detects a potential match."
            name="matchAlertsEnabled"
            checked={form.matchAlertsEnabled}
            onChange={handleChange}
          />

          <ToggleSwitch
            label="Officer Registration Alerts"
            description="Notify when a new officer registration is submitted."
            name="newOfficerRequestAlerts"
            checked={form.newOfficerRequestAlerts}
            onChange={handleChange}
          />

          <ToggleSwitch
            label="Found Report Alerts"
            description="Notify when a new found person report is created."
            name="foundReportAlerts"
            checked={form.foundReportAlerts}
            onChange={handleChange}
          />
        </SettingSection>
      </SettingsCard>

      <SaveBar
        dirty={dirty}
        saving={saving}
        onSave={handleSave}
        onReset={handleReset}
      />
    </>
  );
}

export default NotificationSettings;