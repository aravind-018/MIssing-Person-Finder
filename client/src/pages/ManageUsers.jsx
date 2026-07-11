import { useEffect, useState } from "react";
import "../styles/ManageUsers.css";
import UserCard from "../components/user/UserCard";
import OfficerStatCard from "../components/user/OfficerStatCard";
import ConfirmModal from "../components/common/ConfirmModal";
import useConfirmModal from "../hooks/useConfirmModal";
import {
  showSuccess,
  showError,
} from "../utils/toast";

import {
  getAllUsers,
  approveUser,
  rejectUser,
  suspendUser,
  reactivateUser,
  deleteUser,
} from "../services/userService";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");


  const pendingUsers = users.filter(
  (user) => user.status === "pending"
);

const activeUsers = users.filter(
  (user) => user.status === "active"
);

const suspendedUsers = users.filter(
  (user) => user.status === "suspended"
);

const rejectedUsers = users.filter(
  (user) => user.status === "rejected"
);

let displayedUsers = [];

switch (activeTab) {
  case "active":
    displayedUsers = activeUsers;
    break;

  case "suspended":
    displayedUsers = suspendedUsers;
    break;

  case "rejected":
    displayedUsers = rejectedUsers;
    break;

  default:
    displayedUsers = pendingUsers;
}

const {
  confirmModal,
  openConfirmModal,
  closeConfirmModal,
} = useConfirmModal();

  useEffect(() => {
    fetchUsers();

  }, []);

  const fetchUsers  = async () => {
    try {
      setLoading(true);

      const data = await getAllUsers();

      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
  try {
    await approveUser(id);

    showSuccess("Officer approved successfully.");

    fetchUsers();
  } catch (error) {
    console.error(error);

    showError("Failed to approve officer.");
  }
};

const handleReject = async (id) => {
  try {
    await rejectUser(id);

   showSuccess("Officer rejected successfully.");

    fetchUsers();
  } catch (error) {
    console.error(error);

    showError("Failed to reject officer.");
  }
};

const handleSuspend = async (id) => {
  try {
    await suspendUser(id);

    showSuccess("Officer suspended successfully.");

    fetchUsers();
  } catch (error) {
    console.error(error);

    showError("Failed to suspend officer.");
  }
};

const handleReactivate = async (id) => {
  try {
    await reactivateUser(id);

    showSuccess("Officer reactivated successfully.");

    fetchUsers();
  } catch (error) {
    console.error(error);

    showError("Failed to reactivate officer.");
  }
};

const handleDelete = async (id) => {
  try {
    await deleteUser(id);

    showSuccess("Officer deleted successfully.");

    fetchUsers();
  } catch (error) {
    console.error(error);

    showError("Failed to delete officer.");
  }
};

  if (loading) {
    return (
      <div className="manage-users-page">
        <h2>Loading pending users...</h2>
      </div>
    );
  }

  return (
    <div className="manage-users-page">
      <h1>Officer Management</h1>

      <p className="pending-count">
      Manage officer accounts, approvals and permissions.
      </p>


      <div className="officer-stats">

  <OfficerStatCard
    title="Total Officers"
    value={users.length}
    color="#38bdf8"
  />

  <OfficerStatCard
    title="Pending"
    value={pendingUsers.length}
    color="#facc15"
  />

  <OfficerStatCard
    title="Active"
    value={activeUsers.length}
    color="#22c55e"
  />

  <OfficerStatCard
    title="Suspended"
    value={suspendedUsers.length}
    color="#ef4444"
  />

</div>

<div className="officer-tabs">

  <button
    className={activeTab === "pending" ? "active" : ""}
    onClick={() => setActiveTab("pending")}
  >
    Pending ({pendingUsers.length})
  </button>

  <button
    className={activeTab === "active" ? "active" : ""}
    onClick={() => setActiveTab("active")}
  >
    Active ({activeUsers.length})
  </button>

  <button
    className={activeTab === "suspended" ? "active" : ""}
    onClick={() => setActiveTab("suspended")}
  >
    Suspended ({suspendedUsers.length})
  </button>

  <button
    className={activeTab === "rejected" ? "active" : ""}
    onClick={() => setActiveTab("rejected")}
  >
    Rejected ({rejectedUsers.length})
  </button>

</div>




      {displayedUsers.length === 0 ? (
        <div className="empty-state">
          No pending approval requests.
        </div>
      ) : (
        <div className="users-grid">
          {displayedUsers.map((user) => (
 <UserCard
  key={user._id}
  user={user}
  onApprove={(id) =>
    openConfirmModal({
      title: "Approve Officer",
      message: "Are you sure you want to approve this officer?",
      confirmText: "Approve",
      confirmClass: "confirm-approve",
      onConfirm: async () => {
        await handleApprove(id);
        closeConfirmModal();
      },
    })
  }
  onReject={(id) =>
    openConfirmModal({
      title: "Reject Officer",
      message: "Are you sure you want to reject this officer?",
      confirmText: "Reject",
      confirmClass: "confirm-reject",
      onConfirm: async () => {
        await handleReject(id);
        closeConfirmModal();
      },
    })
  }
  onSuspend={(id) =>
    openConfirmModal({
      title: "Suspend Officer",
      message: "Are you sure you want to suspend this officer?",
      confirmText: "Suspend",
      confirmClass: "confirm-suspend",
      onConfirm: async () => {
        await handleSuspend(id);
        closeConfirmModal();
      },
    })
  }
  onReactivate={(id) =>
    openConfirmModal({
      title: "Reactivate Officer",
      message: "Are you sure you want to reactivate this officer?",
      confirmText: "Reactivate",
      confirmClass: "confirm-reactivate",
      onConfirm: async () => {
        await handleReactivate(id);
        closeConfirmModal();
      },
    })
  }
  onDelete={(id) =>
    openConfirmModal({
      title: "Delete Officer",
      message: "This action cannot be undone. Delete this officer?",
      confirmText: "Delete",
      confirmClass: "confirm-delete",
      onConfirm: async () => {
        await handleDelete(id);
        closeConfirmModal();
      },
    })
  }
/>
))}


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
      )}
    </div>
  );
}

export default ManageUsers;