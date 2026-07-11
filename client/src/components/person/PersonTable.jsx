import "./PersonTable.css";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

import { useLocation, useNavigate } from "react-router-dom";

function PersonTable({ persons = [], onDelete }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const basePath = location.pathname.startsWith("/admin")
  ? "/admin"
  : "/officer";

  return (
    <div className="table-container">
      <table className="person-table">
        <thead>
          <tr>
            <th>Case No.</th>
            <th>Photo</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Contact</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {persons.length ? (
            persons.map((person) => (
              <tr key={person._id}>
                <td>{person.caseNumber}</td>
                <td className="photo-cell">
                  {person.images?.length ? (
                    <img
                      src={`http://localhost:5000/uploads/${person.images[0]}`}
                      alt={person.name}
                      className="person-photo"
                    />
                  ) : (
                    <span className="no-image">No Image</span>
                  )}
                </td>

                <td>{person.name}</td>
                <td>{person.age}</td>
                <td>{person.gender}</td>
                <td>{person.contact}</td>
                <td>{person.address}</td>

                <td>
                  <div className="action-buttons">
                    <button
                      className="view-btn"
                      onClick={() => navigate(`${basePath}/person/${person._id}`)}
                      title="View"
                    >
                      <FaEye />
                    </button>

                    <button
                      className="edit-btn"
                      onClick={() => navigate(`${basePath}/person/edit/${person._id}`)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>

                    {isAdmin && (
  <button
    className="delete-btn"
    onClick={() => onDelete(person._id)}
    title="Delete"
  >
    <FaTrash />
  </button>
)}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="no-data">
                No matching person found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PersonTable;