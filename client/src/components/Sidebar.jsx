import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUserPlus,
  FaUsers,
  FaUserShield,
  FaVideo,
  FaSearch,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: <FaHome />,
      path: "/dashboard",
    },
    {
    title: "Register Missing Person",
    icon: <FaUserPlus />,
    path: "/register",
},
{
    title: "Manage Missing Persons",
    icon: <FaUsers />,
    path: "/manage-persons",
},

{
    title: "Register Officer",
    icon: <FaUserShield />,
    path: "/register-officer",
},

    {
      title: "Manage Users",
      icon: <FaUserShield />,
      path: "/manage-users",
    },
    {
      title: "Upload Video",
      icon: <FaVideo />,
      path: "/upload",
    },
    {
      title: "Results",
      icon: <FaSearch />,
      path: "/results",
    },
    {
      title: "Settings",
      icon: <FaCog />,
      path: "/settings",
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <h1>GodsEye</h1>
          <p>Missing Person Finder</p>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >
              {item.icon}
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;