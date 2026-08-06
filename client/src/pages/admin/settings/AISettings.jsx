import { FaRobot } from "react-icons/fa";

import LoadingSpinner from "../../../components/common/LoadingSpinner";
import SettingsCard from "../../../components/common/SettingsCard";
import SaveBar from "../../../components/common/SaveBar";

import SettingSection from "../../../components/settings/SettingSection";
import SettingInput from "../../../components/settings/SettingInput";
import SettingSelect from "../../../components/settings/SettingSelect";
import ToggleSwitch from "../../../components/settings/ToggleSwitch";

import useSettingsForm from "../../../hooks/useSettingsForm";
import { updateAISettings } from "../../../services/settingsService";

const validateAI = (form) => {
  if (
    typeof form.faceMatchThreshold === "number" &&
    (form.faceMatchThreshold < 0 || form.faceMatchThreshold > 1)
  ) {
    return "Face match threshold must be between 0.0 and 1.0.";
  }
  if (
    typeof form.minDetectionScore === "number" &&
    (form.minDetectionScore < 0 || form.minDetectionScore > 1)
  ) {
    return "Confidence threshold must be between 0.0 and 1.0.";
  }
  if (
    typeof form.defaultFrameInterval === "number" &&
    (form.defaultFrameInterval < 1 || form.defaultFrameInterval > 300)
  ) {
    return "Default frame interval must be between 1 and 300 frames.";
  }
  if (
    typeof form.maxUploadImages === "number" &&
    (form.maxUploadImages < 1 || form.maxUploadImages > 50)
  ) {
    return "Maximum upload images must be between 1 and 50.";
  }
  if (
    typeof form.processingTimeout === "number" &&
    (form.processingTimeout < 5 || form.processingTimeout > 300)
  ) {
    return "Processing timeout must be between 5 and 300 seconds.";
  }
  return null;
};

function AISettings() {
  const {
    form,
    loading,
    saving,
    dirty,
    handleChange,
    handleReset,
    handleSave,
  } = useSettingsForm("ai", updateAISettings, validateAI);

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
          title="Engine Status"
          description="Master toggle for AI facial detection and recognition features."
        >
          <ToggleSwitch
            label="AI Enabled"
            description="Enable or disable automated face recognition processing system-wide."
            name="aiEnabled"
            checked={form.aiEnabled ?? true}
            onChange={handleChange}
          />
        </SettingSection>

        <SettingSection
          title="Recognition Thresholds"
          description="These settings affect face detection accuracy and confidence criteria."
        >
          <SettingInput
            label="Face Match Threshold"
            description="Minimum similarity score required to declare a positive match."
            type="number"
            name="faceMatchThreshold"
            value={form.faceMatchThreshold ?? 0.45}
            onChange={handleChange}
            min={0}
            max={1}
            step={0.01}
            suffix="score (0-1)"
          />

          <SettingInput
            label="Confidence Threshold"
            description="Minimum confidence score required before face matching is evaluated."
            type="number"
            name="minDetectionScore"
            value={form.minDetectionScore ?? 0.5}
            onChange={handleChange}
            min={0}
            max={1}
            step={0.01}
            suffix="score (0-1)"
          />
        </SettingSection>

        <SettingSection
          title="Model Selection"
          description="Choose deep learning models for detection and recognition."
        >
          <SettingSelect
            label="Detection Model"
            name="detectionModel"
            value={form.detectionModel || "buffalo_l"}
            onChange={handleChange}
            options={[
              { label: "InsightFace (Buffalo_L / RetinaFace)", value: "buffalo_l" },
              { label: "RetinaFace Standard", value: "retinaface" },
              { label: "MTCNN (Multi-task Cascaded CNN)", value: "mtcnn" },
            ]}
          />

          <SettingSelect
            label="Recognition Model"
            name="recognitionModel"
            value={form.recognitionModel || "arcface"}
            onChange={handleChange}
            options={[
              { label: "ArcFace (Additive Angular Margin Loss)", value: "arcface" },
              { label: "FaceNet (Triplet Loss)", value: "facenet" },
              { label: "MobileFaceNet (Lightweight)", value: "mobileface" },
            ]}
          />
        </SettingSection>

        <SettingSection
          title="Processing & Limits"
          description="Performance tuning parameters for image and video analysis."
        >
          <SettingInput
            label="Default Frame Interval"
            description="Number of frames skipped between processed CCTV frames."
            type="number"
            name="defaultFrameInterval"
            value={form.defaultFrameInterval ?? 5}
            onChange={handleChange}
            min={1}
            max={300}
            suffix="frames"
          />

          <SettingInput
            label="Maximum Upload Images"
            description="Maximum number of reference face photos allowed per person profile."
            type="number"
            name="maxUploadImages"
            value={form.maxUploadImages ?? 10}
            onChange={handleChange}
            min={1}
            max={50}
            suffix="images"
          />

          <SettingInput
            label="Processing Timeout"
            description="Maximum allowed duration for an AI processing job before timing out."
            type="number"
            name="processingTimeout"
            value={form.processingTimeout ?? 60}
            onChange={handleChange}
            min={5}
            max={300}
            suffix="seconds"
          />
        </SettingSection>

        <SettingSection
          title="Automation & Indexing"
          description="Behavioral controls for face indexing and record generation."
        >
          <ToggleSwitch
            label="Auto Create Detection"
            description="Automatically create a detection record whenever a match is identified."
            name="autoCreateDetectionOnMatch"
            checked={form.autoCreateDetectionOnMatch ?? true}
            onChange={handleChange}
          />

          <ToggleSwitch
            label="Auto Face Indexing"
            description="Automatically generate 512-d embeddings upon photo upload."
            name="autoFaceIndexing"
            checked={form.autoFaceIndexing ?? true}
            onChange={handleChange}
          />

          <ToggleSwitch
            label="Duplicate Face Detection"
            description="Flag redundant reference photos during person profile registration."
            name="duplicateFaceDetection"
            checked={form.duplicateFaceDetection ?? true}
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