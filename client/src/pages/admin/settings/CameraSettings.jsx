import { FaVideo } from "react-icons/fa";

import LoadingSpinner from "../../../components/common/LoadingSpinner";
import SettingsCard from "../../../components/common/SettingsCard";
import SaveBar from "../../../components/common/SaveBar";

import SettingSection from "../../../components/settings/SettingSection";
import SettingInput from "../../../components/settings/SettingInput";
import TagInput from "../../../components/settings/TagInput";

import useSettingsForm from "../../../hooks/useSettingsForm";
import { updateCameraSettings } from "../../../services/settingsService";

function CameraSettings() {
  const {
    form,
    loading,
    saving,
    dirty,
    handleChange,
    setField,
    handleReset,
    handleSave,
  } = useSettingsForm("camera", updateCameraSettings);

  if (loading || !form) {
    return <LoadingSpinner text="Loading Camera Settings..." />;
  }

  return (
    <>
      <SettingsCard
        icon={<FaVideo />}
        title="Camera Settings"
        description="Configure default camera behaviour and video upload options."
      >
        <SettingSection
          title="Camera Locations"
          description="Manage frequently used CCTV camera locations."
        >
          <TagInput
            label="Default Camera Locations"
            description="These locations can be reused while uploading videos."
            placeholder="Enter camera location..."
            value={form.defaultLocations}
            onChange={(value) =>
              setField("defaultLocations", value)
            }
            buttonText="Add"
          />
        </SettingSection>

        <SettingSection
          title="Video Storage"
          description="Configure video storage and upload limits."
        >
          <SettingInput
            label="Recording Retention Days"
            description="Automatically remove recordings older than this."
            type="number"
            name="recordingRetentionDays"
            value={form.recordingRetentionDays}
            onChange={handleChange}
            min={1}
            max={365}
            suffix="days"
          />

          <SettingInput
            label="Maximum Upload Size"
            description="Maximum size allowed for uploaded videos."
            type="number"
            name="maxUploadSizeMb"
            value={form.maxUploadSizeMb}
            onChange={handleChange}
            min={1}
            max={2048}
            suffix="MB"
          />
        </SettingSection>

        <SettingSection
          title="Supported Formats"
          description="Allowed video file formats."
        >
          <TagInput
            label="Video Formats"
            description="Example: mp4, avi, mov"
            placeholder="Enter format..."
            value={form.allowedVideoFormats}
            onChange={(value) =>
              setField("allowedVideoFormats", value)
            }
            buttonText="Add"
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

export default CameraSettings;