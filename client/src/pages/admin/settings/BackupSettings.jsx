import { FaDatabase, FaDownload } from "react-icons/fa";

import LoadingSpinner from "../../../components/common/LoadingSpinner";
import SettingsCard from "../../../components/common/SettingsCard";
import SaveBar from "../../../components/common/SaveBar";

import SettingSection from "../../../components/settings/SettingSection";
import SettingInput from "../../../components/settings/SettingInput";
import SettingSelect from "../../../components/settings/SettingSelect";
import ToggleSwitch from "../../../components/settings/ToggleSwitch";

import useSettingsForm from "../../../hooks/useSettingsForm";
import {
  updateBackupSettings,
  downloadBackup,
} from "../../../services/settingsService";

const validateBackup = (form) => {
  if (
    typeof form.retentionCount === "number" &&
    (form.retentionCount < 1 || form.retentionCount > 60)
  ) {
    return "Backup retention count must be between 1 and 60 backups.";
  }
  return null;
};

function BackupSettings() {
  const {
    form,
    loading,
    saving,
    dirty,
    handleChange,
    handleReset,
    handleSave,
  } = useSettingsForm("backup", updateBackupSettings, validateBackup);

  if (loading || !form) {
    return <LoadingSpinner text="Loading Backup Settings..." />;
  }

  return (
    <>
      <SettingsCard
        icon={<FaDatabase />}
        title="Backup Settings"
        description="Configure automated database backup schedules, locations, and export snapshots."
      >
        <SettingSection
          title="Automatic Backup Schedule"
          description="Configure how and when the system automatically creates backup snapshots."
        >
          <ToggleSwitch
            label="Automatic Backup"
            description="Automatically generate database backups on the selected schedule."
            name="autoBackupEnabled"
            checked={form.autoBackupEnabled ?? false}
            onChange={handleChange}
          />

          <SettingSelect
            label="Backup Frequency"
            description="Choose how often automatic backups are created."
            name="backupFrequency"
            value={form.backupFrequency || "weekly"}
            onChange={handleChange}
            options={[
              { label: "Daily", value: "daily" },
              { label: "Weekly", value: "weekly" },
              { label: "Monthly", value: "monthly" },
            ]}
          />

          <SettingInput
            label="Backup Time"
            description="Daily execution time for scheduled backups (24-hour HH:MM format)."
            type="text"
            name="backupTime"
            value={form.backupTime || "02:00"}
            onChange={handleChange}
            placeholder="02:00"
          />

          <SettingInput
            label="Backup Location"
            description="Filesystem directory path where automatic backup files are stored."
            type="text"
            name="backupLocation"
            value={form.backupLocation || "/var/backups/godseye"}
            onChange={handleChange}
            placeholder="/var/backups/godseye"
          />

          <SettingInput
            label="Retention Count"
            description="Maximum number of backup snapshots to retain on disk before rotation."
            type="number"
            name="retentionCount"
            value={form.retentionCount ?? 5}
            onChange={handleChange}
            min={1}
            max={60}
            suffix="backups"
          />

          <SettingInput
            label="Last Backup Completed"
            description="Timestamp of the most recent successful automated or manual backup."
            value={
              form.lastBackupAt
                ? new Date(form.lastBackupAt).toLocaleString()
                : "No backup has been created yet."
            }
            disabled
          />
        </SettingSection>

        <SettingSection
          title="Download System Snapshot"
          description="Export a full JSON snapshot of system database records."
        >
          <button
            type="button"
            className="settings-download-btn"
            onClick={downloadBackup}
          >
            <FaDownload />
            Download Backup
          </button>
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

export default BackupSettings;