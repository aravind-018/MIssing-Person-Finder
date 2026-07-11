import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/common/ConfirmModal";
import useConfirmModal from "../hooks/useConfirmModal";
import {
  showSuccess,
  showError,
} from "../utils/toast";


import {
  getAllPersons,
  deletePerson,
} from "../services/personService";

import PersonTable from "../components/person/PersonTable";

function ManagePersons() {
  const [persons, setPersons] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("All");
  const [age, setAge] = useState("All");
  const [status, setStatus] = useState("All");
  const {
  confirmModal,
  openConfirmModal,
  closeConfirmModal,
} = useConfirmModal();



  function handleEdit(person) {
    navigate("/register", {
      state: person,
    });
  }

  async function handleDelete(id) {
  openConfirmModal({
    title: "Delete Missing Person",
    message: "Are you sure you want to permanently delete this missing person record?",
    confirmText: "Delete",
    confirmClass: "confirm-delete",

    onConfirm: async () => {
      try {
        await deletePerson(id);

        setPersons((prevPersons) =>
          prevPersons.filter((person) => person._id !== id)
        );

        showSuccess("Missing person deleted successfully.");

        closeConfirmModal();
      } catch (error) {
        console.error(error);

        showError("Failed to delete missing person.");

        closeConfirmModal();
      }
    },
  });
}

 useEffect(() => {
  (async () => {
    try {
      const data = await getAllPersons();

      console.log("Fetched data:", data);

      setPersons(data);
    } catch (error) {
      console.error(error);
    }
  })();
}, []);

const filteredPersons = persons.filter(
  ({
    caseNumber,
    name,
    contact,
    address,
    gender: g,
    age: a,
    status: s,
  }) =>
    [caseNumber, name, contact, address].some((v) =>
      v?.toLowerCase().includes(search.toLowerCase())
    ) &&
    (gender === "All" || g === gender) &&
    (status === "All" || s === status) &&
    (age === "All" ||
      (age === "<18" && a < 18) ||
      (age === "18-30" && a >= 18 && a <= 30) ||
      (age === "31-50" && a >= 31 && a <= 50) ||
      (age === "50+" && a > 50))
);

  return (
    <div
  style={{
    padding: "30px",
    background: "#0f172a",
    minHeight: "100vh",
    color: "#fff",
  }}
>
      <h1>Manage Missing Persons</h1>

     <div className="search-container">
  <input
    type="text"
    placeholder="🔍 Search by Case No, Name, Contact or Address..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="search-box"
  />
</div>

<div className="filters">
  <select value={gender} onChange={(e) => setGender(e.target.value)}>
    <option>All</option>
    <option>Male</option>
    <option>Female</option>
    <option>Other</option>
  </select>

  <select value={status} onChange={(e) => setStatus(e.target.value)}>
    <option value="All">All Status</option>
    <option value="Missing">Missing</option>
    <option value="Found">Found</option>
  </select>

  <select value={age} onChange={(e) => setAge(e.target.value)}>
    <option>All</option>
    <option value="<18">Below 18</option>
    <option value="18-30">18 - 30</option>
    <option value="31-50">31 - 50</option>
    <option value="50+">Above 50</option>
  </select>

  <button
    className="reset-btn"
    onClick={() => {
      setSearch("");
      setGender("All");
      setStatus("All");
      setAge("All");
    }}
  >
    Reset Filters
  </button>
</div>

<p style={{ color: "#cbd5e1", marginBottom: "15px" }}>
  Showing <strong>{filteredPersons.length}</strong> of{" "}
  <strong>{persons.length}</strong> records
</p>





      <PersonTable
        persons={filteredPersons}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <ConfirmModal
  isOpen={confirmModal.isOpen}
  title={confirmModal.title}
  message={confirmModal.message}
  confirmText={confirmModal.confirmText}
  confirmClass={confirmModal.confirmClass}
  onCancel={closeConfirmModal}
  onConfirm={confirmModal.onConfirm}
/>
    </div>
  );
}

export default ManagePersons;