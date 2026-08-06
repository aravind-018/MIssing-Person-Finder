import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPersonById } from "../../services/api";
import "../../styles/PersonDetails.css";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatusControl from "../../components/person/StatusControl";
import {
    FaUser,
    FaBirthdayCake,
    FaMale,
    FaExclamationTriangle,
    FaPhone,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaTshirt,
    FaStickyNote,
    FaClock,
} from "react-icons/fa";
import { useLocation } from "react-router-dom";


function PersonDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState("");
    const location = useLocation();

    const basePath = location.pathname.startsWith("/admin")
    ? "/admin"
    : "/officer";

    const [showLightbox, setShowLightbox] = useState(false);
    const [person, setPerson] = useState(null);

    useEffect(() => {
        fetchPerson();
    }, []);

    const fetchPerson = async () => {
        try {
            const response = await getPersonById(id);
            setPerson(response.data);
            if (response.data.images.length > 0) {
    setSelectedImage(response.data.images[0]);
}
        } catch (error) {
            // Error handled silently; UI remains unchanged for user
        }
    };

    if (!person) {
        return <LoadingSpinner text="Loading Officers..." />
    }

    return (
  <div className="person-details-container">
    <div className="page-header">

<h2 className="page-title">Case Details</h2>

<p className="subtitle">
    {person.caseNumber}
</p>
</div>

    <div className="details-card">

      <div className="image-section">

    <div className="main-image-container">
<img
    src={`http://localhost:5000/uploads/${selectedImage}`}
    alt={person.name}
    className="main-image"
    onClick={() => setShowLightbox(true)}
/>
    </div>

    <div className="thumbnail-container">
        {person.images.map((image, index) => (
            <img
                key={index}
                src={`http://localhost:5000/uploads/${image}`}
                alt={`Thumbnail ${index + 1}`}
                className={`thumbnail ${
                    selectedImage === image ? "active-thumbnail" : ""
                }`}
                onClick={() => setSelectedImage(image)}
            />
        ))}
    </div>

</div>

<div className="summary-cards">

    <div className="summary-card">
    <FaStickyNote className="summary-icon" />
    <h4>Case No.</h4>
    <p>{person.caseNumber || "N/A"}</p>
</div>

    <div className="summary-card">
        <FaUser className="summary-icon" />
        <h4>Name</h4>
        <p>{person.name}</p>
    </div>

    <div className="summary-card">
        <FaBirthdayCake className="summary-icon" />
        <h4>Age</h4>
        <p>{person.age}</p>
    </div>

    <div className="summary-card">
        <FaMale className="summary-icon" />
        <h4>Gender</h4>
        <p>{person.gender}</p>
    </div>

<span className="status-badge">
    {person.status === "Found"
        ? "🟢 Found"
        : person.status === "Closed"
        ? "⚫ Closed"
        : "🔴 Missing"}
</span>

<StatusControl person={person} onUpdated={setPerson} />

</div>

      <div className="details-grid">


<div className="detail-item">
    <strong>
        <FaPhone /> Contact
    </strong>
    <p>{person.contact || "Not Available"}</p>
</div>

<div className="detail-item full-width">
    <strong>
        <FaMapMarkerAlt /> Address
    </strong>
    <p>{person.address || "Not Available"}</p>
</div>

<div className="detail-item">
    <strong>
        <FaCalendarAlt /> Missing Since
    </strong>
    <p>
        {person.missingSince
            ? new Date(person.missingSince).toLocaleDateString("en-IN")
            : "Not Available"}
    </p>
</div>

<div className="detail-item">
    <strong>
        <FaCalendarAlt /> Last Seen
    </strong>
    <p>{person.lastSeen || "Not Available"}</p>
</div>

<div className="detail-item">
    <strong>
        <FaTshirt /> Clothing
    </strong>
    <p>{person.clothing || "Not Available"}</p>
</div>

<div className="detail-item full-width">
    <strong>
        <FaStickyNote /> Notes
    </strong>
    <p>{person.notes || "Not Available"}</p>
</div>

<div className="detail-item">
    <strong>
        <FaClock /> Registered On
    </strong>
    <p>
        {new Date(person.createdAt).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })}
    </p>
</div>


      </div>


       <div className="action-bar">

    <button
        className="back-btn"
        onClick={() => navigate(-1)}
    >
        ← Back to Manage
    </button>

<button
    className="details-edit-btn"
    onClick={() => navigate(`${basePath}/person/edit/${person._id}`)}
>
    ✏ Edit
</button>

</div>
    </div>

    {showLightbox && (
    <div
        className="lightbox"
        onClick={() => setShowLightbox(false)}
    >
        <span className="close-btn">&times;</span>

        <img
            src={`http://localhost:5000/uploads/${selectedImage}`}
            alt={person.name}
            className="lightbox-image"
            onClick={(e) => e.stopPropagation()}
        />
    </div>
)}
  </div>
);
}

export default PersonDetails;
