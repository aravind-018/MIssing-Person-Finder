import { useEffect, useRef } from "react";
import { getMyFoundReports, getPendingFoundReports } from "../services/foundReportService";
import { showInfo, showSuccess, showWarning } from "../utils/toast";

function FoundReportNotifications({ role }) {
  const known = useRef(new Map());
  useEffect(() => {
    const load = async (initial) => {
      try {
        const reports = role === "admin" ? await getPendingFoundReports() : await getMyFoundReports();
        const next = new Map(reports.map((report) => [report._id, report.status]));
        if (!initial) reports.forEach((report) => {
          const previous = known.current.get(report._id);
          if (role === "admin" && !previous) showInfo(`New Found Report submitted for ${report.person?.name || "a case"}.`);
          if (role === "officer" && previous === "Pending" && report.status === "Approved") showSuccess(`Your Found Report for ${report.person?.name || "a case"} was approved.`);
          if (role === "officer" && previous === "Pending" && report.status === "Rejected") showWarning(`Your Found Report for ${report.person?.name || "a case"} was rejected.`);
        });
        known.current = next;
      } catch { /* Notifications must never interrupt the portal. */ }
    };
    load(true); const interval = window.setInterval(() => load(false), 30000);
    return () => window.clearInterval(interval);
  }, [role]);
  return null;
}
export default FoundReportNotifications;
