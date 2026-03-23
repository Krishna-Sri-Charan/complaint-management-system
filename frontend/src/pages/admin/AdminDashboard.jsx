import { useEffect, useState } from "react";
import API from "../../services/api";

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints");
      setComplaints(res.data.data.content); // because pagination
    } catch (error) {
      console.log(error);
    }
  };

  const assignTechnician = async (complaintId) => {
    const technicianId = prompt("Enter Technician ID:");

    try {
      await API.put(
        `/admin/assign-technician?complaintId=${complaintId}&technicianId=${technicianId}`
      );

      alert("Technician Assigned");
      fetchComplaints();
    } catch (error) {
      alert("Error assigning technician");
    }
  };

  const updateStatus = async (complaintId) => {
    const status = prompt("Enter Status (OPEN, IN_PROGRESS, RESOLVED)");

    try {
      await API.put(
        `/admin/update-status?complaintId=${complaintId}&status=${status}`
      );

      alert("Status Updated");
      fetchComplaints();
    } catch (error) {
      alert("Error updating status");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Admin Dashboard</h2>

      {complaints.map((c) => (
        <div key={c.id} style={{ border: "1px solid", margin: "10px", padding: "10px" }}>
          <h4>{c.title}</h4>
          <p>Status: {c.status}</p>
          <p>Priority: {c.priority}</p>

          <button onClick={() => assignTechnician(c.id)}>
            Assign Technician
          </button>

          <button onClick={() => updateStatus(c.id)}>
            Update Status
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;