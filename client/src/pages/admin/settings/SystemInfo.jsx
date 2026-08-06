import { useEffect, useState } from "react";
import { FaServer, FaSyncAlt } from "react-icons/fa";

import LoadingSpinner from "../../../components/common/LoadingSpinner";
import SettingsCard from "../../../components/common/SettingsCard";
import SettingSection from "../../../components/settings/SettingSection";

import { getSystemInfo } from "../../../services/settingsService";
import { showError } from "../../../utils/toast";

function SystemInfo() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadInfo = async () => {
    try {
      setLoading(true);
      const data = await getSystemInfo();
      setInfo(data);
    } catch (error) {
      // Error handled for the user; avoid developer console output in production
      showError("Failed to load system information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInfo();
  }, []);

  if (loading || !info) {
    return <LoadingSpinner text="Loading System Information..." />;
  }

  const uptime = `${Math.floor(info.server.uptimeSeconds / 3600)}h ${Math.floor(
    (info.server.uptimeSeconds % 3600) / 60
  )}m`;

  return (
    <SettingsCard
      icon={<FaServer />}
      title="System Information"
      description="Live status of the server, database, AI service and system statistics."
      actions={
        <button
          type="button"
          className="settings-refresh-btn"
          onClick={loadInfo}
        >
          <FaSyncAlt />
          Refresh
        </button>
      }
    >
      <SettingSection
        title="Server"
        description="Current backend server information."
      >
        <div className="settings-info-grid">
          <InfoTile label="Environment" value={info.server.environment} />
          <InfoTile label="Node Version" value={info.server.nodeVersion} />
          <InfoTile label="Port" value={info.server.port} />
          <InfoTile label="Uptime" value={uptime} />
        </div>
      </SettingSection>

      <SettingSection
        title="Services"
        description="Current health of connected services."
      >
        <div className="settings-info-grid">
          <StatusTile
            label="Database"
            value={info.database.status}
          />

          <InfoTile
            label="Database Name"
            value={info.database.name || "-"}
          />

          <StatusTile
            label="AI Service"
            value={info.aiService.status}
          />
        </div>
      </SettingSection>

      <SettingSection
        title="System Statistics"
        description="Current record counts."
      >
        <div className="settings-info-grid">
          <InfoTile
            label="Officers"
            value={info.counts.totalOfficers}
          />

          <InfoTile
            label="Pending Officers"
            value={info.counts.pendingOfficers}
          />

          <InfoTile
            label="Missing Persons"
            value={info.counts.missingPersons}
          />

          <InfoTile
            label="Detections"
            value={info.counts.totalDetections}
          />

          <InfoTile
            label="Recognition Sessions"
            value={info.counts.totalRecognitionSessions}
          />
        </div>
      </SettingSection>
    </SettingsCard>
  );
}

function InfoTile({ label, value }) {
  return (
    <div className="settings-info-tile">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </div>
  );
}

function StatusTile({ label, value }) {
  return (
    <div className="settings-info-tile">
      <div className="label">{label}</div>

      <div className={`status-pill ${value}`}>
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </div>
    </div>
  );
}

export default SystemInfo;