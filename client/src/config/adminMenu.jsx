import {
  FaHome,
  FaUserPlus,
  FaUsers,
  FaUserShield,
  FaVideo,
  FaSearch,
  FaCog,
} from "react-icons/fa";

const adminMenu = [
  {
    title: "Dashboard",
    icon: <FaHome />,
    path: "/admin/dashboard",
  },
  {
    title: "Register Missing Person",
    icon: <FaUserPlus />,
    path: "/admin/register",
  },
  {
    title: "Manage Missing Persons",
    icon: <FaUsers />,
    path: "/admin/manage-persons",
  },
  {
    title: "Register Officer",
    icon: <FaUserShield />,
    path: "/admin/register-officer",
  },
  {
    title: "Officer Management",
    icon: <FaUserShield />,
    path: "/admin/manage-users",
  },
  {
    title: "Upload Video",
    icon: <FaVideo />,
    path: "/admin/upload",
  },
  {
    title: "Results",
    icon: <FaSearch />,
    path: "/admin/results",
  },
  {
    title: "Settings",
    icon: <FaCog />,
    path: "/admin/settings",
  },
];

export default adminMenu;