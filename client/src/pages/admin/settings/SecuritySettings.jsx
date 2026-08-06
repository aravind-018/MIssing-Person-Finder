import { FaShieldAlt } from "react-icons/fa";

import LoadingSpinner from "../../../components/common/LoadingSpinner";
import SettingsCard from "../../../components/common/SettingsCard";
import SaveBar from "../../../components/common/SaveBar";

import SettingSection from "../../../components/settings/SettingSection";
import SettingInput from "../../../components/settings/SettingInput";
import ToggleSwitch from "../../../components/settings/ToggleSwitch";
import TagInput from "../../../components/settings/TagInput";

import useSettingsForm from "../../../hooks/useSettingsForm";
import { updateSecuritySettings } from "../../../services/settingsService";

const validateSecurity = (form) => {
  if (
    typeof form.sessionTimeoutMinutes === "number" &&
    (form.sessionTimeoutMinutes < 5 || form.sessionTimeoutMinutes > 1440)
  ) {
    return "Session timeout must be between 5 and 1440 minutes.";
  }
  if (
    typeof form.minPasswordLength === "number" &&
    (form.minPasswordLength < 6 || form.minPasswordLength > 32)
  ) {
    return "Minimum password length must be between 6 and 32 characters.";
  }
  if (
    typeof form.maxLoginAttempts === "number" &&
    (form.maxLoginAttempts < 3 || form.maxLoginAttempts > 20)
  ) {
    return "Maximum login attempts must be between 3 and 20 attempts.";
  }
  if (
    typeof form.lockoutDuration === "number" &&
    (form.lockoutDuration < 1 || form.lockoutDuration > 1440)
  ) {
    return "Lockout duration must be between 1 and 1440 minutes.";
  }
  return null;
};

function SecuritySettings() {
  const {
    form,
    loading,
    saving,
    dirty,
    handleChange,
    setField,
    handleReset,
    handleSave,
  } = useSettingsForm("security", updateSecuritySettings, validateSecurity);

  if (loading || !form) {
    return <LoadingSpinner text="Loading Security Settings..." />;
  }

  return (
    <>
      <SettingsCard
        icon={<FaShieldAlt />}
        title="Security Settings"
        description="Configure authentication rules, password policies, access control, and auditing."
      >
        <SettingSection
          title="Session & Timeout"
          description="Control active user sessions and inactivity limits."
        >
          <SettingInput
            label="Session Timeout"
            description="Automatically log out inactive users."
            type="number"
            name="sessionTimeoutMinutes"
            value={form.sessionTimeoutMinutes ?? 60}
            onChange={handleChange}
            min={5}
            max={1440}
            suffix="minutes"
          />
        </SettingSection>

        <SettingSection
          title="Password Policy"
          description="Enforce security strength requirements for officer passwords."
        >
          <SettingInput
            label="Minimum Password Length"
            description="Minimum number of characters required for user passwords."
            type="number"
            name="minPasswordLength"
            value={form.minPasswordLength ?? 8}
            onChange={handleChange}
            min={6}
            max={32}
            suffix="characters"
          />

          <ToggleSwitch
            label="Require Strong Password"
            description="Enforce inclusion of uppercase, lowercase, numbers, and special symbols."
            name="requireStrongPassword"
            checked={form.requireStrongPassword ?? true}
            onChange={handleChange}
          />
        </SettingSection>

        <SettingSection
          title="Login Lockout & Authentication"
          description="Prevent brute-force authentication attacks and configure multi-factor rules."
        >
          <SettingInput
            label="Maximum Login Attempts"
            description="Maximum failed login attempts before locking out account."
            type="number"
            name="maxLoginAttempts"
            value={form.maxLoginAttempts ?? 5}
            onChange={handleChange}
            min={3}
            max={20}
            suffix="attempts"
          />

          <SettingInput
            label="Lockout Duration"
            description="Duration accounts remain locked after exceeding failed login attempts."
            type="number"
            name="lockoutDuration"
            value={form.lockoutDuration ?? 15}
            onChange={handleChange}
            min={1}
            max={1440}
            suffix="minutes"
          />

          <ToggleSwitch
            label="Two-Factor Authentication (2FA)"
            description="Require two-factor verification for officer and admin logins."
            name="twoFactorAuth"
            checked={form.twoFactorAuth ?? false}
            onChange={handleChange}
          />

          <ToggleSwitch
            label="Auto Approve Officers"
            description="Automatically activate newly registered officer accounts upon sign up."
            name="autoApproveOfficers"
            checked={form.autoApproveOfficers ?? false}
            onChange={handleChange}
          />
        </SettingSection>

        <SettingSection
          title="Access Control & Auditing"
          description="Restrict administrative access by IP address and track security events."
        >
          <TagInput
            label="Allowed IP Addresses"
            description="Restrict system access exclusively to specific IP addresses or subnets (leave blank to allow all IPs)."
            placeholder="e.g. 192.168.1.100 or 10.0.0.0/24"
            value={form.allowedIps || []}
            onChange={(value) => setField("allowedIps", value)}
            buttonText="Add IP"
          />

          <ToggleSwitch
            label="Audit Logging"
            description="Log critical administrative actions, login events, and profile modifications."
            name="auditLoggingEnabled"
            checked={form.auditLoggingEnabled ?? true}
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