import { useEffect, useState } from "react";
import {
  FaHistory,
  FaSyncAlt,
  FaUserShield,
  FaUserAlt,
  FaSearch,
  FaVideo,
} from "react-icons/fa";

import LoadingSpinner from "../../../components/common/LoadingSpinner";
import SettingsCard from "../../../components/common/SettingsCard";
import SettingSection from "../../../components/settings/SettingSection";

import { getActivityLogs } from "../../../services/settingsService";
import { showError } from "../../../utils/toast";

const ICONS = {
  officer_registered: <FaUserShield />,
  officer_status_changed: <FaUserShield />,
  person_registered: <FaUserAlt />,
  detection_match: <FaSearch />,
  recognition_session: <FaVideo />,
};

function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await getActivityLogs();
      setLogs(data);
    } catch (error) {
      console.error(error);
      showError("Failed to load activity logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading Activity Logs..." />;
  }

  return (
    <SettingsCard
      icon={<FaHistory />}
      title="Activity Logs"
      description="Recent activities across the GodsEye system."
      actions={
        <button
          type="button"
          className="settings-refresh-btn"
          onClick={loadLogs}
        >
          <FaSyncAlt />
          Refresh
        </button>
      }
    >
      <SettingSection
        title="Recent Activity"
        description="Latest actions performed in the system."
      >
        {logs.length === 0 ? (
          <div className="settings-empty">
            No recent activity available.
          </div>
        ) : (
          <div className="activity-list">
            {logs.map((log, index) => (
              <div
                className="activity-item"
                key={`${log.type}-${log.at}-${index}`}
              >
                <div className="activity-icon">
                  {ICONS[log.type] || <FaHistory />}
                </div>

                <div className="activity-content">
                  <p>{log.message}</p>

                  <div className="activity-time">
                    {new Date(log.at).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SettingSection>
    </SettingsCard>
  );
}

export default ActivityLogs;