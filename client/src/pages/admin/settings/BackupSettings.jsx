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

function BackupSettings() {
  const {
    form,
    loading,
    saving,
    dirty,
    handleChange,
    handleReset,
    handleSave,
  } = useSettingsForm("backup", updateBackupSettings);

  if (loading || !form) {
    return (
      <LoadingSpinner text="Loading Backup Settings..." />
    );
  }

  return (
    <>
      <SettingsCard
        icon={<FaDatabase />}
        title="Backup Settings"
        description="Configure automatic backups and export the complete system."
      >
        <SettingSection
          title="Automatic Backup"
          description="Configure how the system creates backup snapshots."
        >
          <ToggleSwitch
            label="Enable Automatic Backup"
            description="Automatically generate backups on the selected schedule."
            name="autoBackupEnabled"
            checked={form.autoBackupEnabled}
            onChange={handleChange}
          />

          <SettingSelect
            label="Backup Frequency"
            description="Choose how often automatic backups are created."
            name="backupFrequency"
            value={form.backupFrequency}
            onChange={handleChange}
            options={[
              { label: "Daily", value: "daily" },
              { label: "Weekly", value: "weekly" },
              { label: "Monthly", value: "monthly" },
            ]}
          />

          <SettingInput
            label="Retention Count"
            description="Maximum number of backup snapshots to retain."
            type="number"
            name="retentionCount"
            value={form.retentionCount}
            onChange={handleChange}
            min={1}
            max={60}
            suffix="backups"
          />

          <SettingInput
            label="Last Backup"
            description="Time of the most recent successful backup."
            value={
              form.lastBackupAt
                ? new Date(form.lastBackupAt).toLocaleString()
                : "No backup has been created yet."
            }
            disabled
          />
        </SettingSection>

        <SettingSection
          title="Manual Backup"
          description="Download a complete JSON snapshot of the current system."
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