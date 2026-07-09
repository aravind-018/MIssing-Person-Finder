import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RegisterPerson from "./pages/RegisterPerson";
import UploadVideo from "./pages/UploadVideo";
import Results from "./pages/Results";
import Settings from "./pages/Settings";
import ManagePersons from "./pages/ManagePersons";
import PersonDetails from "./pages/PersonDetails";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<RegisterPerson />} />
        <Route path="/upload" element={<UploadVideo />} />
        <Route path="/results" element={<Results />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/manage-persons" element={<ManagePersons />} />
        <Route path="/person/:id" element={<PersonDetails />} />
        <Route path="/person/edit/:id" element={<RegisterPerson />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;