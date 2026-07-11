import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";

import FormInput from "../../components/common/FormInput";
import ConfirmModal from "../../components/common/ConfirmModal";
import useConfirmModal from "../../hooks/useConfirmModal";

import {
  showSuccess,
  showError,
} from "../../utils/toast";

import { changePassword } from "../../services/authService";

import "../../styles/RegisterOfficer.css";

function ChangePassword() {
  const navigate = useNavigate();

  const {
    confirmModal,
    openConfirmModal,
    closeConfirmModal,
  } = useConfirmModal();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitPasswordChange = async () => {
    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      closeConfirmModal();

      showSuccess("Password changed successfully.");

      navigate("/officer/profile");

    } catch (error) {
      closeConfirmModal();

      showError(
        error.response?.data?.message ||
          "Failed to change password."
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      return showError("Please fill in all fields.");
    }

    if (formData.newPassword.length < 8) {
      return showError(
        "Password must be at least 8 characters."
      );
    }

    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      return showError(
        "Passwords do not match."
      );
    }

    openConfirmModal({
      title: "Change Password",
      message:
        "Are you sure you want to change your password?",
      confirmText: "Change",
      confirmClass: "confirm-btn",
      onConfirm: submitPasswordChange,
    });
  };

  return (
    <>
      <div className="register-officer-page">
        <div className="register-officer-card">

          <div className="register-header">
            <div className="header-icon">
              <FaLock />
            </div>

            <h2  className="page-title" >Change Password</h2>

            <p className="register-subtitle">
              Update your account password.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <FormInput
              label="Current Password"
              icon={<FaLock />}
              type="password"
              placeholder="Enter current password"
              value={formData.currentPassword}
              onChange={handleChange}
              name="currentPassword"
            />

            <FormInput
              label="New Password"
              icon={<FaLock />}
              type="password"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleChange}
              name="newPassword"
            />

            <FormInput
              label="Confirm Password"
              icon={<FaLock />}
              type="password"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              name="confirmPassword"
            />

            <button type="submit">
              Change Password
            </button>

          </form>

        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        confirmClass={confirmModal.confirmClass}
        onConfirm={confirmModal.onConfirm}
        onCancel={closeConfirmModal}
      />
    </>
  );
}

export default ChangePassword;