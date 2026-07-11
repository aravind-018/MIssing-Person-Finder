import "./RecentCases.css";
import { useNavigate } from "react-router-dom";

function RecentCases({ persons, detailsPath }) {
  const navigate = useNavigate();

  return (
    <div className="recent-cases">
      <h2>Recent Cases</h2>

      {persons.length ? (
        persons.map((person) => (
          <div
            key={person._id}
            className="recent-card"
            onClick={() => navigate(`${detailsPath}/${person._id}`)}
          >
            <img
              src={
                person.images?.length
                  ? `http://localhost:5000/uploads/${person.images[0]}`
                  : "/placeholder.png"
              }
              alt={person.name}
              className="recent-photo"
            />

            <div className="recent-info">
              <h3>{person.name}</h3>

              <p>{person.caseNumber}</p>

              <div className="recent-details">
                <span
                  className={`status-badge ${
                    person.status === "Missing"
                      ? "status-missing"
                      : "status-found"
                  }`}
                >
                  {person.status}
                </span>

                <small>
                  {new Date(person.createdAt).toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})}
                </small>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No recent cases.</p>
      )}
    </div>
  );
}

export default RecentCases;