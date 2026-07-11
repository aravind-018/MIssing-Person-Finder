import {
  FaHome,
  FaUserPlus,
  FaUsers,
  FaUser,
  FaLock,
} from "react-icons/fa";

const officerMenu = [
  {
    title: "Dashboard",
    icon: <FaHome />,
    path: "/officer/dashboard",
  },
  {
    title: "Register Missing Person",
    icon: <FaUserPlus />,
    path: "/officer/register",
  },
  {
    title: "Manage Missing Persons",
    icon: <FaUsers />,
    path: "/officer/manage-persons",
  },
  {
    title: "My Profile",
    icon: <FaUser />,
    path: "/officer/profile",
  },
  {
    title: "Change Password",
    icon: <FaLock />,
    path: "/officer/change-password",
  },
];

export default officerMenu;