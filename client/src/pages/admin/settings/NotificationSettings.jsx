import { FaBell } from "react-icons/fa";

import LoadingSpinner from "../../../components/common/LoadingSpinner";
import SettingsCard from "../../../components/common/SettingsCard";
import SaveBar from "../../../components/common/SaveBar";

import SettingSection from "../../../components/settings/SettingSection";
import SettingInput from "../../../components/settings/SettingInput";
import ToggleSwitch from "../../../components/settings/ToggleSwitch";

import useSettingsForm from "../../../hooks/useSettingsForm";
import { updateNotificationSettings } from "../../../services/settingsService";

const validateNotifications = (form) => {
  if (
    form.alertEmail &&
    form.alertEmail.trim() !== "" &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.alertEmail)
  ) {
    return "Please enter a valid alert email address.";
  }
  return null;
};

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
    updateNotificationSettings,
    validateNotifications
  );

  if (loading || !form) {
    return <LoadingSpinner text="Loading Notification Settings..." />;
  }

  return (
    <>
      <SettingsCard
        icon={<FaBell />}
        title="Notification Settings"
        description="Configure notification channels, event triggers, and recurring summaries."
      >
        <SettingSection
          title="Notification Channels"
          description="Master toggles for alert delivery mechanisms."
        >
          <SettingInput
            label="Alert Email Address"
            description="Primary email address for system notification delivery."
            type="email"
            name="alertEmail"
            value={form.alertEmail || ""}
            onChange={handleChange}
            placeholder="admin@example.com"
          />

          <ToggleSwitch
            label="Email Notifications"
            description="Master switch for sending email notifications."
            name="emailAlertsEnabled"
            checked={form.emailAlertsEnabled ?? true}
            onChange={handleChange}
          />

          <ToggleSwitch
            label="Browser Notifications"
            description="Display real-time desktop / browser push alerts."
            name="browserNotifications"
            checked={form.browserNotifications ?? true}
            onChange={handleChange}
          />
        </SettingSection>

        <SettingSection
          title="Event Triggers & Alerts"
          description="Choose specific operational events that dispatch immediate alerts."
        >
          <ToggleSwitch
            label="Match Alerts"
            description="Send an alert whenever a AI face match occurs."
            name="matchAlertsEnabled"
            checked={form.matchAlertsEnabled ?? true}
            onChange={handleChange}
          />

          <ToggleSwitch
            label="Case Assignment Alerts"
            description="Notify officers when missing person cases are assigned to them."
            name="caseAssignmentAlerts"
            checked={form.caseAssignmentAlerts ?? true}
            onChange={handleChange}
          />

          <ToggleSwitch
            label="Officer Registration Alerts"
            description="Notify administrators when a new officer account request is filed."
            name="newOfficerRequestAlerts"
            checked={form.newOfficerRequestAlerts ?? true}
            onChange={handleChange}
          />

          <ToggleSwitch
            label="Found Report Alerts"
            description="Notify when a public or officer found person report is submitted."
            name="foundReportAlerts"
            checked={form.foundReportAlerts ?? true}
            onChange={handleChange}
          />
        </SettingSection>

        <SettingSection
          title="Automated Digest Summaries"
          description="Configure automated periodic status reports."
        >
          <ToggleSwitch
            label="Daily Summary"
            description="Receive a daily email summarizing total sightings, detections, and pending cases."
            name="dailySummary"
            checked={form.dailySummary ?? false}
            onChange={handleChange}
          />

          <ToggleSwitch
            label="Weekly Summary"
            description="Receive a weekly analytical digest of system metrics and case updates."
            name="weeklySummary"
            checked={form.weeklySummary ?? true}
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