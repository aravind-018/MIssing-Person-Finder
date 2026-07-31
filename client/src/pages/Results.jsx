import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getRecognitionSession } from "../services/recognitionService";
import "../styles/CCTV.css";

const formatTimestamp = (seconds) => {
  const rounded = Math.floor(seconds || 0);
  return `${String(Math.floor(rounded / 60)).padStart(2, "0")}:${String(rounded % 60).padStart(2, "0")}`;
};

function Results() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const personPath = pathname.startsWith("/officer") ? "/officer/person" : "/admin/person";
  const [session, setSession] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const loadSession = async () => {
      try {
        setSession(await getRecognitionSession(id));
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Could not load recognition results.");
      }
    };
    loadSession();
  }, [id]);

  if (!id) return <section className="cctv-page"><div className="cctv-empty-state">Choose a recognition session from history.</div></section>;
  if (error) return <section className="cctv-page"><div className="cctv-empty-state">{error}</div></section>;
  if (!session) return <section className="cctv-page"><div className="cctv-empty-state">Loading recognition results...</div></section>;

  const statistics = [
    { label: "Total Frames", value: session.totalFrames },
    { label: "Processed Frames", value: session.processedFrames },
    { label: "Faces Detected", value: session.totalFacesDetected },
    { label: "Matches Found", value: session.matches.length },
  ];

  return (
    <section className="cctv-page">
      <header className="cctv-page-header"><h2 className="page-title">CCTV Recognition Results</h2><p>{session.cameraLocation} · {session.videoName}</p></header>
      <div className="cctv-stats-grid">{statistics.map((stat) => <article className="cctv-stat-card" key={stat.label}><span>{stat.label}</span><strong>{stat.value ?? 0}</strong></article>)}</div>
      <h3 className="cctv-results-heading">Top 3 Matches</h3>
      {session.matches.length === 0 ? <div className="cctv-empty-state">No face match met the configured similarity threshold.</div> : (
        <div className="cctv-match-grid">{session.matches.map((match, index) => (
          <article className="cctv-match-card" key={`${match.previewImage}-${index}`}>
            <div className="cctv-match-image-wrap"><img src={`http://localhost:5000/uploads/${match.previewImage}`} alt={`Annotated CCTV match for ${session.person?.name || "selected person"}`} /><span className="cctv-match-badge">Match</span></div>
            <div className="cctv-match-content">
              <h3>{session.person ? <Link to={`${personPath}/${session.person._id}`}>{session.person.name}</Link> : "Missing person"}</h3>
              <p className="cctv-case-number">Case No. {session.person?.caseNumber || "N/A"}</p>
              <div className="cctv-match-meta">
                <div><span>Confidence</span><strong className="cctv-confidence">{(match.confidence * 100).toFixed(1)}%</strong></div>
                <div><span>Timestamp</span><strong>{formatTimestamp(match.timestamp)}</strong></div>
                <div><span>Frame Number</span><strong>{match.frameNumber}</strong></div>
                <div className="cctv-meta-wide"><span>Camera Location</span><strong>{session.cameraLocation}</strong></div>
              </div>
            </div>
          </article>
        ))}</div>
      )}
    </section>
  );
}

export default Results;
