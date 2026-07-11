import { useState } from "react";

function useConfirmModal() {
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    confirmClass: "confirm-btn",
    onConfirm: null,
  });

  const openConfirmModal = ({
    title,
    message,
    confirmText = "Confirm",
    confirmClass = "confirm-btn",
    onConfirm,
  }) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText,
      confirmClass,
      onConfirm,
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  return {
    confirmModal,
    openConfirmModal,
    closeConfirmModal,
  };
}

export default useConfirmModal;