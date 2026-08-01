import { useEffect, useState } from "react";
import { updatePersonStatus } from "../../services/personService";
import { getMyFoundReports } from "../../services/foundReportService";
import { showError, showSuccess } from "../../utils/toast";
import FoundReportModal from "./FoundReportModal";
import "./StatusControl.css";

function StatusControl({ person, onUpdated, compact = false }) {
  const [status, setStatus] = useState(person.status);
  const [saving, setSaving] = useState(false);
  const [pending, setPending] = useState(false);
  const [reporting, setReporting] = useState(false);
  const role = JSON.parse(localStorage.getItem("user") || "{}").role;
  const canChange = role === "admin";
  const options = ["Missing", "Found", "Closed"];
  useEffect(() => { if (role === "officer" && person.status === "Missing") getMyFoundReports().then((reports) => setPending(reports.some((report) => report.person?._id === person._id && report.status === "Pending"))).catch(() => {}); }, [person._id, person.status, role]);

  const save = async () => {
    try {
      setSaving(true);
      const updated = await updatePersonStatus(person._id, status);
      onUpdated(updated);
      showSuccess("Case status updated.");
    } catch (error) {
      setStatus(person.status);
      showError(error.response?.data?.message || "Could not update case status.");
    } finally { setSaving(false); }
  };

  return <div className={`case-status-control ${compact ? "case-status-compact" : ""}`}>
    <span className={`case-status-badge status-${pending ? "pending" : person.status.toLowerCase()}`}>{pending ? "Pending Approval" : person.status}</span>
    {canChange && <><select aria-label="Change case status" value={status} disabled={saving} onChange={(event) => setStatus(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select><button type="button" disabled={saving || status === person.status} onClick={save}>{saving ? "Saving..." : "Save status"}</button></>}
    {role === "officer" && person.status === "Missing" && !pending && <button type="button" onClick={() => setReporting(true)}>Mark as Found</button>}
    {reporting && <FoundReportModal person={person} onClose={() => setReporting(false)} onSubmitted={() => setPending(true)} />}
  </div>;
}

export default StatusControl;
