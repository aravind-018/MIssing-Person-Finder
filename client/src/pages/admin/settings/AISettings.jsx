import { FaRobot } from "react-icons/fa";

import LoadingSpinner from "../../../components/common/LoadingSpinner";
import SettingsCard from "../../../components/common/SettingsCard";
import SaveBar from "../../../components/common/SaveBar";

import SettingSection from "../../../components/settings/SettingSection";
import SettingInput from "../../../components/settings/SettingInput";
import ToggleSwitch from "../../../components/settings/ToggleSwitch";

import useSettingsForm from "../../../hooks/useSettingsForm";
import { updateAISettings } from "../../../services/settingsService";

function AISettings() {
  const {
    form,
    loading,
    saving,
    dirty,
    handleChange,
    handleReset,
    handleSave,
  } = useSettingsForm("ai", updateAISettings);
  
  if (loading || !form) {
    return <LoadingSpinner text="Loading AI Settings..." />;
  }

  return (
    <>
      <SettingsCard
        icon={<FaRobot />}
        title="AI Settings"
        description="Configure the behaviour of the facial recognition engine."
      >
        <SettingSection
          title="Recognition Configuration"
          description="These settings affect how the AI detects and matches faces."
        >
          <SettingInput
            label="Face Match Threshold"
            description="Minimum confidence required to confirm a face match."
            type="number"
            name="faceMatchThreshold"
            value={form.faceMatchThreshold}
            onChange={handleChange}
            min={0}
            max={1}
            step={0.01}
            suffix="confidence"
          />

          <SettingInput
            label="Default Frame Interval"
            description="Number of frames skipped during video processing."
            type="number"
            name="defaultFrameInterval"
            value={form.defaultFrameInterval}
            onChange={handleChange}
            min={1}
            max={300}
            suffix="frames"
          />

          <SettingInput
            label="Minimum Detection Score"
            description="Minimum confidence required before attempting face matching."
            type="number"
            name="minDetectionScore"
            value={form.minDetectionScore}
            onChange={handleChange}
            min={0}
            max={1}
            step={0.01}
            suffix="confidence"
          />

          <ToggleSwitch
            label="Auto Create Detection"
            description="Automatically create a detection record whenever a successful face match is found."
            name="autoCreateDetectionOnMatch"
            checked={form.autoCreateDetectionOnMatch}
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

export default AISettings;