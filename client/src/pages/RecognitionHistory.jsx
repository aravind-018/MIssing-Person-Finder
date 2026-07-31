import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ConfirmModal from "../components/common/ConfirmModal";
import useConfirmModal from "../hooks/useConfirmModal";
import { deleteRecognitionSession, getRecognitionSessions } from "../services/recognitionService";
import { showError, showSuccess } from "../utils/toast";
import "../styles/CCTV.css";

function RecognitionHistory() {
  const { pathname } = useLocation();
  const basePath = pathname.startsWith("/officer") ? "/officer" : "/admin";
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { confirmModal, openConfirmModal, closeConfirmModal } = useConfirmModal();

  useEffect(() => {
    const loadSessions = async () => {
      try {
        setSessions(await getRecognitionSessions());
      } catch (error) {
        showError(error.response?.data?.message || "Could not load recognition history.");
      } finally {
        setLoading(false);
      }
    };
    loadSessions();
  }, []);

  const confirmDelete = (session) => openConfirmModal({
    title: "Delete Recognition Session",
    message: "This permanently removes the session and its matched preview images. Detection records are retained.",
    confirmText: "Delete",
    confirmClass: "confirm-delete",
    onConfirm: async () => {
      try {
        await deleteRecognitionSession(session._id);
        setSessions((current) => current.filter(({ _id }) => _id !== session._id));
        showSuccess("Recognition session deleted.");
      } catch (error) {
        showError(error.response?.data?.message || "Could not delete recognition session.");
      } finally {
        closeConfirmModal();
      }
    },
  });

  return (
    <section className="cctv-page">
      <header className="cctv-page-header"><h2 className="page-title">Recognition History</h2><p>Stored CCTV analyses, newest first.</p></header>
      {loading ? <div className="cctv-empty-state">Loading recognition history...</div> : sessions.length === 0 ? <div className="cctv-empty-state">No recognition sessions have been stored yet.</div> : (
        <div className="recognition-history-grid">{sessions.map((session) => (
          <article className="recognition-history-card" key={session._id}>
            <div><span className="recognition-history-date">{new Date(session.createdAt).toLocaleString("en-IN")}</span><h3>{session.person?.name || "Missing person"}</h3><p>{session.person?.caseNumber || "Case unavailable"}</p></div>
            <div className="recognition-history-meta"><span>{session.videoName}</span><span>{session.cameraLocation}</span><strong>{session.matches.length} match{session.matches.length === 1 ? "" : "es"}</strong></div>
            <div className="recognition-history-actions"><Link className="recognition-view-btn" to={`${basePath}/results/${session._id}`}>View</Link><button className="recognition-delete-btn" type="button" onClick={() => confirmDelete(session)}>Delete</button></div>
          </article>
        ))}</div>
      )}
      <ConfirmModal isOpen={confirmModal.isOpen} title={confirmModal.title} message={confirmModal.message} confirmText={confirmModal.confirmText} confirmClass={confirmModal.confirmClass} onCancel={closeConfirmModal} onConfirm={confirmModal.onConfirm} />
    </section>
  );
}

export default RecognitionHistory;
