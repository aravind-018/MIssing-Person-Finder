import {
  FaCog,
  FaGlobe,
} from "react-icons/fa";

import LoadingSpinner from "../../../components/common/LoadingSpinner";
import SettingsCard from "../../../components/common/SettingsCard";
import SaveBar from "../../../components/common/SaveBar";

import SettingSection from "../../../components/settings/SettingSection";
import SettingInput from "../../../components/settings/SettingInput";
import SettingSelect from "../../../components/settings/SettingSelect";
import ToggleSwitch from "../../../components/settings/ToggleSwitch";

import useSettingsForm from "../../../hooks/useSettingsForm";
import { updateGeneralSettings } from "../../../services/settingsService";

function GeneralSettings() {
  const {
    form,
    loading,
    saving,
    dirty,
    handleChange,
    handleReset,
    handleSave,
  } = useSettingsForm("general", updateGeneralSettings);

  if (loading || !form) {
    return <LoadingSpinner text="Loading General Settings..." />;
  }

  return (
    <>
      <SettingsCard
        icon={<FaCog />}
        title="General Settings"
        description="Configure the basic system preferences used across GodsEye."
      >
        <SettingSection
          title="Application"
          description="Basic information about this installation."
        >
          <SettingInput
            label="System Name"
            name="systemName"
            value={form.systemName}
            onChange={handleChange}
            placeholder="GodsEye"
          />

          <SettingInput
            label="Organization Name"
            name="organizationName"
            value={form.organizationName}
            onChange={handleChange}
            placeholder="Police Department"
          />

          <SettingInput
            label="Support Email"
            type="email"
            name="supportEmail"
            value={form.supportEmail}
            onChange={handleChange}
            placeholder="support@example.com"
          />
        </SettingSection>

        <SettingSection
          title="Localization"
          description="Regional preferences for date and time."
        >
          <SettingSelect
            label="Time Zone"
            name="timezone"
            value={form.timezone}
            onChange={handleChange}
            options={[
              { label: "Asia/Kolkata", value: "Asia/Kolkata" },
              { label: "UTC", value: "UTC" },
              { label: "Europe/London", value: "Europe/London" },
              { label: "America/New_York", value: "America/New_York" },
            ]}
          />

          <SettingSelect
            label="Date Format"
            name="dateFormat"
            value={form.dateFormat}
            onChange={handleChange}
            options={[
              {
                label: "DD/MM/YYYY",
                value: "DD/MM/YYYY",
              },
              {
                label: "MM/DD/YYYY",
                value: "MM/DD/YYYY",
              },
              {
                label: "YYYY-MM-DD",
                value: "YYYY-MM-DD",
              },
            ]}
          />
        </SettingSection>

        <SettingSection
          title="System"
          description="Control global application behaviour."
        >
          <ToggleSwitch
            label="Maintenance Mode"
            description="Temporarily restrict access while maintenance is in progress."
            name="maintenanceMode"
            checked={form.maintenanceMode}
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

export default GeneralSettings;