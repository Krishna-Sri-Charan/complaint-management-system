import { useEffect, useState } from "react";
import API from "../../services/api";

function TechnicianDashboard() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);
  
  const fetchComplaints = async () => {
    try {
        const res = await API.get("/technician/complaints?technicianId=4");

        console.log("API RESPONSE:", res);

        setComplaints(res.data);
    } catch (error) {
        console.log(error);
        setComplaints([]);
    }
  };

  const updateStatus = async (complaintId) => {
    const status = prompt("Enter Status (IN_PROGRESS, RESOLVED)");

    try {
      await API.put(
        `/technician/update-status?complaintId=${complaintId}&status=${status}`
      );

      alert("Status Updated");
      fetchComplaints();
    } catch (error) {
      alert("Error updating status");
    }
  };

  const addUpdate = async (complaintId) => {
    const message = prompt("Enter update note");

    try {
      await API.post(
        `/technician/add-update?complaintId=${complaintId}&technicianId=4&message=${message}`
      );

      alert("Update Added");
      fetchComplaints();
    } catch (error) {
      alert("Error adding update");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Technician Dashboard</h2>

      {complaints?.map((c) => (
        <div key={c.id} style={{ border: "1px solid", margin: "10px", padding: "10px" }}>
          <h4>{c.title}</h4>
          <p>Status: {c.status}</p>
          <p>Priority: {c.priority}</p>

          <button onClick={() => updateStatus(c.id)}>
            Update Status
          </button>

          <button onClick={() => addUpdate(c.id)}>
            Add Update
          </button>
        </div>
      ))}
    </div>
  );
}

export default TechnicianDashboard;