import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RegisterPerson from "./pages/RegisterPerson";
import UploadVideo from "./pages/UploadVideo";
import Results from "./pages/Results";
import Settings from "./pages/Settings";
import ManagePersons from "./pages/ManagePersons";
import PersonDetails from "./pages/PersonDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import ManageUsers from "./pages/ManageUsers";
import MainLayout from "./layouts/MainLayout";
import RegisterOfficer from "./pages/auth/RegisterOfficer";
    
function App() {
  return (
    <BrowserRouter>
      <Routes>
  {/* Public Route */}
  <Route path="/" element={<Login />} />

  {/* Protected Routes */}
<Route element={<ProtectedRoute />}>
  <Route element={<MainLayout />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/register" element={<RegisterPerson />} />
    <Route path="/register-officer" element={<RegisterOfficer />}/>
    <Route path="/upload" element={<UploadVideo />} />
    <Route path="/results" element={<Results />} />
    <Route path="/settings" element={<Settings />} />
    <Route path="/manage-persons" element={<ManagePersons />} />
    <Route path="/manage-users" element={<ManageUsers />} />
    <Route path="/person/:id" element={<PersonDetails />} />
    <Route path="/person/edit/:id" element={<RegisterPerson />} />
 
  </Route>
</Route>
</Routes>
    </BrowserRouter>
  );
}

export default App;