import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { recognizeVideo } from "../services/aiService";
import { getAllPersons } from "../services/personService";
import { showError } from "../utils/toast";
import "../styles/CCTV.css";

const formatFileSize = (size) => {
  if (!size) return "MP4, AVI, or MOV";
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

function UploadVideo() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const basePath = pathname.startsWith("/officer") ? "/officer" : "/admin";
  const [video, setVideo] = useState(null);
  const [persons, setPersons] = useState([]);
  const [personId, setPersonId] = useState("");
  const [location, setLocation] = useState("");
  const [frameInterval, setFrameInterval] = useState(5);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const loadPersons = async () => {
      try {
        const data = await getAllPersons();
        setPersons(data.filter((person) => person.status === "Missing"));
      } catch {
        showError("Could not load missing-person cases.");
      }
    };

    loadPersons();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (!video || !personId || !location.trim()) {
      showError("Select a missing person, CCTV video, and camera location.");
      return;
    }

    const form = new FormData();
    form.append("video", video);
    form.append("personId", personId);
    form.append("location", location.trim());
    form.append("frameInterval", frameInterval);

    try {
      setProcessing(true);
      const { data } = await recognizeVideo(form);
      navigate(`${basePath}/results/${data.sessionId}`);
    } catch (error) {
      showError(error.response?.data?.message || "CCTV video recognition failed.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section className="cctv-page">
      <header className="cctv-page-header">
        <h2 className="page-title">CCTV Video Recognition</h2>
        <p>Select an active case and analyze CCTV footage for the strongest face matches.</p>
      </header>

      <form className="cctv-upload-card cctv-form" onSubmit={submit}>
        <h3 className="cctv-card-heading">Recognition Configuration</h3>
        <div className="cctv-field">
          <label htmlFor="missing-person">Missing person</label>
          <select id="missing-person" value={personId} onChange={(event) => setPersonId(event.target.value)} required>
            <option value="">Select a missing-person case</option>
            {persons.map((person) => <option key={person._id} value={person._id}>{person.caseNumber} - {person.name}</option>)}
          </select>
        </div>
        <div className="cctv-field">
          <label htmlFor="cctv-video">CCTV footage</label>
          <input className="cctv-file-input" id="cctv-video" type="file" accept="video/mp4,video/x-msvideo,video/quicktime,.mp4,.avi,.mov" onChange={(event) => setVideo(event.target.files?.[0] || null)} required />
          <label className="cctv-file-control" htmlFor="cctv-video">
            <span className="cctv-file-icon" aria-hidden="true">▶</span>
            <span className="cctv-file-copy"><strong>{video ? video.name : "Choose CCTV video"}</strong><span>{video ? formatFileSize(video.size) : "MP4, AVI, or MOV"}</span></span>
          </label>
        </div>
        <div className="cctv-field">
          <label htmlFor="detection-location">Camera location</label>
          <input id="detection-location" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="e.g. Kollam Railway Station - Platform 1" required />
        </div>
        <div className="cctv-field">
          <label htmlFor="frame-interval">Process every Nth frame</label>
          <input id="frame-interval" type="number" min="1" max="300" value={frameInterval} onChange={(event) => setFrameInterval(event.target.value)} required />
        </div>
        <button className="cctv-submit-btn" type="submit" disabled={processing}>{processing ? "Processing CCTV video..." : "Analyze video"}</button>
      </form>
    </section>
  );
}

export default UploadVideo;
