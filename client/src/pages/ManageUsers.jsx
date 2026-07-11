import { useEffect, useState } from "react";
import "../styles/ManageUsers.css";

import {
  getPendingUsers,
  approveUser,
  rejectUser,
} from "../services/userService";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingUsers();

  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);

      const data = await getPendingUsers();

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

    alert("User approved successfully!");

    fetchPendingUsers();
  } catch (error) {
    console.error(error);

    alert("Failed to approve user.");
  }
};

const handleReject = async (id) => {
  try {
    await rejectUser(id);

    alert("User rejected successfully!");

    fetchPendingUsers();
  } catch (error) {
    console.error(error);

    alert("Failed to reject user.");
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
      <h1>Pending Police Accounts</h1>

      <p className="pending-count">
        Pending Requests : {users.length}
      </p>

      {users.length === 0 ? (
        <div className="empty-state">
          No pending approval requests.
        </div>
      ) : (
        <div className="users-grid">
          {users.map((user) => (
            <div className="user-card" key={user._id}>
              <h2>{user.name}</h2>

              <p>
                <strong>Email:</strong> {user.email}
              </p>

              <p>
                <strong>Role:</strong> {user.role}
              </p>

              <p>
                <strong>Status:</strong> {user.status}
              </p>

              <p>
                <strong>Joined:</strong>{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>

              <div className="user-actions">
              <button
  className="approve-btn"
  onClick={() => handleApprove(user._id)}
>
  Approve
</button>

                <button
  className="reject-btn"
  onClick={() => handleReject(user._id)}
>
  Reject
</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageUsers;