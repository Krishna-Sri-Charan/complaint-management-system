import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import UserDashboard from "./pages/user/UserDashboard";
import CreateComplaint from "./pages/user/CreateComplaint";
import MyComplaints from "./pages/user/MyComplaints";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TechnicianDashboard from "./pages/technician/TechnicianDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/create-complaint" element={<CreateComplaint />} />
        <Route path="/my-complaints" element={<MyComplaints />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/technician-dashboard" element={<TechnicianDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;