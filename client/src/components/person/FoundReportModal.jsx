import { useState } from "react";
import { createFoundReport } from "../../services/foundReportService";
import { showError, showSuccess } from "../../utils/toast";
import "./FoundReportModal.css";

function FoundReportModal({ person, recognitionId, onClose, onSubmitted }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ foundDate: new Date().toISOString().slice(0, 10), location: "", description: "", notes: "" });
  const [images, setImages] = useState([]);
  const submit = async (event) => {
    event.preventDefault();
    const payload = new FormData();
    payload.append("personId", person._id); payload.append("recognitionId", recognitionId || "");
    payload.append("foundDate", form.foundDate); payload.append("location", form.location); payload.append("description", `${form.description}${form.notes ? `\n\nNotes: ${form.notes}` : ""}`);
    images.forEach((image) => payload.append("evidenceImages", image));
    try { setSaving(true); await createFoundReport(payload); showSuccess("Found Report submitted for admin approval."); onSubmitted(); onClose(); }
    catch (error) { showError(error.response?.data?.message || "Could not submit the Found Report."); }
    finally { setSaving(false); }
  };
  return <div className="found-report-backdrop" onMouseDown={onClose}><form className="found-report-modal" onMouseDown={(event) => event.stopPropagation()} onSubmit={submit}><button className="found-report-close" type="button" onClick={onClose}>×</button><h2>Mark {person.name} as Found</h2><p>This creates a report for administrator approval. The case stays Missing until approved.</p><label>Found date<input required type="date" value={form.foundDate} max={new Date().toISOString().slice(0, 10)} onChange={(event) => setForm({ ...form, foundDate: event.target.value })} /></label><label>Location<input required value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} placeholder="Where was the person found?" /></label><label>Description<textarea required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Describe the circumstances" /></label><label>Evidence images<input type="file" accept="image/*" multiple onChange={(event) => setImages([...event.target.files].slice(0, 5))} /></label><label>Notes (optional)<textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></label><button disabled={saving} type="submit">{saving ? "Submitting..." : "Submit Found Report"}</button></form></div>;
}
export default FoundReportModal;
