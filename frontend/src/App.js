import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import UserDashboard from "./pages/user/UserDashboard";
import CreateComplaint from "./pages/user/CreateComplaint";
import MyComplaints from "./pages/user/MyComplaints";
import ComplaintTimeline from "./pages/user/ComplaintTimeline";

import AdminDashboard from "./pages/admin/AdminDashboard";
import TechnicianDashboard from "./pages/technician/TechnicianDashboard";
import ComplaintDetails from "./pages/common/ComplaintDetails";
import ProfilePage from "./pages/profile/ProfilePage";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        {/* USER ROUTES */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-complaint"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <CreateComplaint />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-complaints"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <MyComplaints />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTE */}

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* TECHNICIAN ROUTE */}

        <Route
          path="/technician-dashboard"
          element={
            <ProtectedRoute allowedRoles={["TECHNICIAN"]}>
              <TechnicianDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaint/:id/timeline"
          element={<ComplaintTimeline />}
        />

        <Route
          path="/complaints/:id/"
          element={<ComplaintDetails />}
        />

        <Route
          path="/profile"
          element={<ProfilePage />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;