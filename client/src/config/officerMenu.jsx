import {
  FaHome,
  FaUserPlus,
  FaUsers,
  FaUser,
  FaLock,
  FaVideo,
  FaHistory,
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
    title: "Upload Video",
    icon: <FaVideo />,
    path: "/officer/upload",
  },
  {
    title: "Recognition History",
    icon: <FaHistory />,
    path: "/officer/recognitions",
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
