import { FaVideo } from "react-icons/fa";

import LoadingSpinner from "../../../components/common/LoadingSpinner";
import SettingsCard from "../../../components/common/SettingsCard";
import SaveBar from "../../../components/common/SaveBar";

import SettingSection from "../../../components/settings/SettingSection";
import SettingInput from "../../../components/settings/SettingInput";
import SettingSelect from "../../../components/settings/SettingSelect";
import ToggleSwitch from "../../../components/settings/ToggleSwitch";
import TagInput from "../../../components/settings/TagInput";

import useSettingsForm from "../../../hooks/useSettingsForm";
import { updateCameraSettings } from "../../../services/settingsService";

const validateCamera = (form) => {
  if (
    typeof form.fps === "number" &&
    (form.fps < 1 || form.fps > 120)
  ) {
    return "FPS must be between 1 and 120.";
  }
  if (
    typeof form.recordingRetentionDays === "number" &&
    (form.recordingRetentionDays < 1 || form.recordingRetentionDays > 365)
  ) {
    return "Recording retention days must be between 1 and 365 days.";
  }
  if (
    typeof form.maxUploadSizeMb === "number" &&
    (form.maxUploadSizeMb < 1 || form.maxUploadSizeMb > 2048)
  ) {
    return "Maximum upload size must be between 1 and 2048 MB.";
  }
  return null;
};

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
  } = useSettingsForm("camera", updateCameraSettings, validateCamera);

  if (loading || !form) {
    return <LoadingSpinner text="Loading Camera Settings..." />;
  }

  return (
    <>
      <SettingsCard
        icon={<FaVideo />}
        title="Camera Settings"
        description="Configure default camera behavior, recording standards, and video storage parameters."
      >
        <SettingSection
          title="Video Streams & Resolution"
          description="Default video quality and capture specifications."
        >
          <SettingSelect
            label="Default Resolution"
            description="Default resolution for processing CCTV video streams."
            name="defaultResolution"
            value={form.defaultResolution || "1080p"}
            onChange={handleChange}
            options={[
              { label: "1080p (Full HD - 1920x1080)", value: "1080p" },
              { label: "720p (HD - 1280x720)", value: "720p" },
              { label: "4K (Ultra HD - 3840x2160)", value: "4k" },
            ]}
          />

          <SettingInput
            label="Frames Per Second (FPS)"
            description="Target capture framerate for video processing."
            type="number"
            name="fps"
            value={form.fps ?? 30}
            onChange={handleChange}
            min={1}
            max={120}
            suffix="FPS"
          />

          <SettingSelect
            label="Recording Quality"
            description="Compression quality tier for stored frames and preview video captures."
            name="recordingQuality"
            value={form.recordingQuality || "high"}
            onChange={handleChange}
            options={[
              { label: "High (Recommended)", value: "high" },
              { label: "Medium (Balanced)", value: "medium" },
              { label: "Low (Bandwidth saver)", value: "low" },
              { label: "Ultra (Uncompressed)", value: "ultra" },
            ]}
          />
        </SettingSection>

        <SettingSection
          title="Detection & Capture Rules"
          description="Behavioural toggles for motion detection and unknown face logging."
        >
          <ToggleSwitch
            label="Motion Detection"
            description="Trigger frame evaluation only when motion is detected in the video stream."
            name="motionDetection"
            checked={form.motionDetection ?? true}
            onChange={handleChange}
          />

          <ToggleSwitch
            label="Save Unknown Faces"
            description="Log and capture snapshots of unmatched faces for future reference."
            name="saveUnknownFaces"
            checked={form.saveUnknownFaces ?? false}
            onChange={handleChange}
          />
        </SettingSection>

        <SettingSection
          title="Camera Locations"
          description="Manage frequently used CCTV camera locations."
        >
          <TagInput
            label="Default Camera Locations"
            description="These locations can be reused while uploading videos."
            placeholder="Enter camera location..."
            value={form.defaultLocations || []}
            onChange={(value) => setField("defaultLocations", value)}
            buttonText="Add"
          />
        </SettingSection>

        <SettingSection
          title="Video Storage & Uploads"
          description="Configure retention policy and file size limits."
        >
          <SettingInput
            label="Retention Days"
            description="Automatically remove recordings older than this."
            type="number"
            name="recordingRetentionDays"
            value={form.recordingRetentionDays ?? 30}
            onChange={handleChange}
            min={1}
            max={365}
            suffix="days"
          />

          <SettingInput
            label="Maximum Upload Size"
            description="Maximum size allowed for uploaded video files."
            type="number"
            name="maxUploadSizeMb"
            value={form.maxUploadSizeMb ?? 500}
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
            value={form.allowedVideoFormats || []}
            onChange={(value) => setField("allowedVideoFormats", value)}
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