 import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

  import Login from "./pages/auth/Login";
  import RegisterOfficer from "./pages/auth/RegisterOfficer";

  import Dashboard from "./pages/admin/Dashboard";
  import RegisterPerson from "./pages/admin/RegisterPerson";
  import ManagePersons from "./pages/admin/ManagePersons";
  import ManageUsers from "./pages/admin/ManageUsers";
  import PersonDetails from "./pages/admin/PersonDetails";
  
  import FoundReports from "./pages/admin/FoundReports";

  import UploadVideo from "./pages/UploadVideo";
  import Results from "./pages/Results";
  import RecognitionHistory from "./pages/RecognitionHistory";

  import ProtectedRoute from "./components/ProtectedRoute";
  import AdminRoute from "./components/AdminRoute";
  import OfficerRoute from "./components/OfficerRoute";

  import AdminLayout from "./layouts/AdminLayout";
  import OfficerLayout from "./layouts/OfficerLayout";
  import OfficerDashboard from "./pages/officer/OfficerDashboard";
  import OfficerProfile from "./pages/officer/OfficerProfile";
  import ChangePassword from "./pages/officer/ChangePassword";

  //settings
import Settings from "./pages/admin/settings/Settings";
import GeneralSettings from "./pages/admin/settings/GeneralSettings";
import AISettings from "./pages/admin/settings/AISettings";
import CameraSettings from "./pages/admin/settings/CameraSettings";
import NotificationSettings from "./pages/admin/settings/NotificationSettings";
import SecuritySettings from "./pages/admin/settings/SecuritySettings";
import BackupSettings from "./pages/admin/settings/BackupSettings";
import SystemInfo from "./pages/admin/settings/SystemInfo";
import ActivityLogs from "./pages/admin/settings/ActivityLogs";


  function App() {

    return (
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Login />} />

          <Route
    path="/register"
    element={<RegisterOfficer />}
  />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>

            {/* ================= ADMIN ================= */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route
                  path="/admin/dashboard"
                  element={<Dashboard />}
                />

                <Route
                  path="/admin/register"
                  element={<RegisterPerson />}
                />

                <Route
                  path="/admin/register-officer"
                  element={<RegisterOfficer />}
                />

                <Route
                  path="/admin/upload"
                  element={<UploadVideo />}
                />

                <Route
                  path="/admin/results"
                  element={<Results />}
                />

                <Route path="/admin/results/:id" element={<Results />} />
                <Route path="/admin/recognitions" element={<RecognitionHistory />} />

                <Route path="/admin/settings" element={<Settings />}>
  <Route index element={<GeneralSettings />} />
  <Route path="general" element={<GeneralSettings />} />
  <Route path="ai" element={<AISettings />} />
  <Route path="camera" element={<CameraSettings />} />
  <Route path="notifications" element={<NotificationSettings />} />
  <Route path="security" element={<SecuritySettings />} />
  <Route path="backup" element={<BackupSettings />} />
  <Route path="system-info" element={<SystemInfo />} />
  <Route path="activity-logs" element={<ActivityLogs />} />
</Route>

                <Route
                  path="/admin/found-reports"
                  element={<FoundReports />}
                />

                <Route
                  path="/admin/manage-persons"
                  element={<ManagePersons />}
                />

                <Route
                  path="/admin/manage-users"
                  element={<ManageUsers />}
                />

                <Route
                  path="/admin/person/:id"
                  element={<PersonDetails />}
                />

                <Route
                  path="/admin/person/edit/:id"
                  element={<RegisterPerson />}
                />
              </Route>
            </Route>

            {/* ================= OFFICER ================= */}
            <Route element={<OfficerRoute />}>
    <Route element={<OfficerLayout />}>

    <Route
    path="/officer/change-password"
    element={<ChangePassword />}
  />

      <Route
        path="/officer/dashboard"
        element={<OfficerDashboard />}
      />

      <Route
        path="/officer/register"
        element={<RegisterPerson />}
      />

      <Route
        path="/officer/manage-persons"
        element={<ManagePersons />}
      />

      <Route
        path="/officer/profile"
        element={<OfficerProfile />}
      />

      <Route
        path="/officer/person/:id"
        element={<PersonDetails />}
      />

      <Route
        path="/officer/person/edit/:id"
        element={<RegisterPerson />}
      />

      <Route path="/officer/upload" element={<UploadVideo />} />
      <Route path="/officer/results/:id" element={<Results />} />
      <Route path="/officer/recognitions" element={<RecognitionHistory />} />

    </Route>
  </Route>

          </Route>
        </Routes>
      </BrowserRouter>
    );
  }

  export default App;
