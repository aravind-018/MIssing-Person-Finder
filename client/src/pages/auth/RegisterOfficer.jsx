import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerOfficer } from "../../services/authService";
import "../../styles/RegisterOfficer.css";
import {
  showSuccess,
  showError,
} from "../../utils/toast";

import {
  FaUserShield,
  FaUser,
  FaBuilding,
} from "react-icons/fa";

function RegisterOfficer() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
const isAdmin = currentUser?.role === "admin";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    department: "Police",
    designation: "",
    badgeNumber: "",
    station: "",
    district: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await registerOfficer({
  ...formData,
  role: "officer",
  status: "pending",
});

if (isAdmin) {
  showSuccess("Officer registered successfully.");

  navigate("/admin/manage-users");
} else {
  showSuccess(
  "Registration submitted successfully. Please wait for administrator approval."
);

  navigate("/");
}

  } catch (error) {
    showError(
  error.response?.data?.message ||
  "Registration failed. Please try again."
);
  }
};

  return (
    <div className="register-officer-page">
      <div className="register-officer-card">

        {/* ================= HEADER ================= */}

        <div className="register-header">

          <div className="header-icon">
            <FaUserShield />
          </div>

          <h2 className="page-title" >
  {isAdmin ? "Register Officer" : "Officer Registration"}
</h2>

<p className="register-subtitle">
  {isAdmin
    ? "Create a new officer account for the GodsEye system."
    : "Create your official GodsEye account. Your account will remain pending until approved by an administrator."}
</p>

        </div>

        <form onSubmit={handleSubmit}>

          {/* ===================================================== */}
          {/* PERSONAL INFORMATION */}
          {/* ===================================================== */}

          <div className="section-title">
            <FaUser />
            <span>Personal Information</span>
          </div>

          {/* <hr className="section-divider" /> */}

          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>

            <input
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* ===================================================== */}
          {/* DEPARTMENT INFORMATION */}
          {/* ===================================================== */}

          <div className="section-title">
            <FaUserShield />
            <span>Department Information</span>
          </div>

          {/* <hr className="section-divider" /> */}

          <div className="form-group">
            <label>Department</label>

            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="Police">Police</option>
              <option value="Crime Branch">Crime Branch</option>
              <option value="CBI">CBI</option>
              <option value="Special Branch">Special Branch</option>
              <option value="Cyber Cell">Cyber Cell</option>
              <option value="Railway Police">Railway Police</option>
              <option value="Women Cell">Women Cell</option>
              <option value="NIA">NIA</option>
            </select>
          </div>

          <div className="form-group">
            <label>Designation</label>

            <input
              type="text"
              name="designation"
              placeholder="Enter designation"
              value={formData.designation}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Badge Number</label>

            <input
              type="text"
              name="badgeNumber"
              placeholder="Enter badge number"
              value={formData.badgeNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div></div>

          {/* ===================================================== */}
          {/* POSTING INFORMATION */}
          {/* ===================================================== */}

          <div className="section-title">
            <FaBuilding />
            <span>Posting Information</span>
          </div>

          {/* <hr className="section-divider" /> */}

          <div className="form-group">
            <label>Station</label>

            <input
              type="text"
              name="station"
              placeholder="Enter station"
              value={formData.station}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>District</label>

            <input
              type="text"
              name="district"
              placeholder="Enter district"
              value={formData.district}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">
  {isAdmin ? "Create Officer" : "Submit Registration"}
</button>
        </form>

      </div>
    </div>
  );
}

export default RegisterOfficer;