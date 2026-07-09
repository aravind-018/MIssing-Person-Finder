import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  function handleEdit(person) {
    navigate("/register", {
      state: person,
    });
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this person?"
    );

    if (!confirmDelete) return;

    try {
      await deletePerson(id);

      setPersons((prevPersons) =>
        prevPersons.filter((person) => person._id !== id)
      );
    } catch (error) {
      console.error(error);
    }
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
  ({ caseNumber, name, contact, address, gender: g, age: a }) =>
    [caseNumber, name, contact, address].some(v =>
      v?.toLowerCase().includes(search.toLowerCase())
    ) &&
    (gender === "All" || g === gender) &&
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
    placeholder="🔍 Search by Name, Contact or Address..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="search-box"
  />
</div>

<div className="filters">
  <select value={gender} onChange={e => setGender(e.target.value)}>
    <option>All</option>
    <option>Male</option>
    <option>Female</option>
    <option>Other</option>
  </select>

  <select value={age} onChange={e => setAge(e.target.value)}>
    <option>All</option>
    <option value="<18">Below 18</option>
    <option value="18-30">18 - 30</option>
    <option value="31-50">31 - 50</option>
    <option value="50+">Above 50</option>
  </select>
</div>



      <PersonTable
        persons={filteredPersons}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
}

export default ManagePersons;