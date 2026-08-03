import { FaShieldAlt } from "react-icons/fa";

import LoadingSpinner from "../../../components/common/LoadingSpinner";
import SettingsCard from "../../../components/common/SettingsCard";
import SaveBar from "../../../components/common/SaveBar";

import SettingSection from "../../../components/settings/SettingSection";
import SettingInput from "../../../components/settings/SettingInput";
import ToggleSwitch from "../../../components/settings/ToggleSwitch";

import useSettingsForm from "../../../hooks/useSettingsForm";
import { updateSecuritySettings } from "../../../services/settingsService";

function SecuritySettings() {
  const {
    form,
    loading,
    saving,
    dirty,
    handleChange,
    handleReset,
    handleSave,
  } = useSettingsForm("security", updateSecuritySettings);

  if (loading || !form) {
    return (
      <LoadingSpinner text="Loading Security Settings..." />
    );
  }

  return (
    <>
      <SettingsCard
        icon={<FaShieldAlt />}
        title="Security Settings"
        description="Configure authentication, password policy and access control."
      >
        <SettingSection
          title="Authentication"
          description="Control user login behaviour and password requirements."
        >
          <SettingInput
            label="Session Timeout"
            description="Automatically log out inactive users."
            type="number"
            name="sessionTimeoutMinutes"
            value={form.sessionTimeoutMinutes}
            onChange={handleChange}
            min={5}
            max={1440}
            suffix="minutes"
          />

          <SettingInput
            label="Minimum Password Length"
            description="Minimum number of characters required."
            type="number"
            name="minPasswordLength"
            value={form.minPasswordLength}
            onChange={handleChange}
            min={6}
            max={32}
            suffix="characters"
          />

          <SettingInput
            label="Maximum Login Attempts"
            description="Maximum failed login attempts before account lock."
            type="number"
            name="maxLoginAttempts"
            value={form.maxLoginAttempts}
            onChange={handleChange}
            min={3}
            max={20}
            suffix="attempts"
          />

          <ToggleSwitch
            label="Require Strong Password"
            description="Require uppercase, lowercase, number and special character."
            name="requireStrongPassword"
            checked={form.requireStrongPassword}
            onChange={handleChange}
          />

          <ToggleSwitch
            label="Auto Approve Officers"
            description="Automatically activate newly registered officer accounts."
            name="autoApproveOfficers"
            checked={form.autoApproveOfficers}
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

export default SecuritySettings;