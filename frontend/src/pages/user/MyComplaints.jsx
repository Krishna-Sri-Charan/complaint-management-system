import { useEffect, useState } from "react";
import API from "../../services/api";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints/my?userId=1");
      setComplaints(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>My Complaints</h2>

      {complaints.map((c) => (
        <div key={c.id} style={{ border: "1px solid", margin: "10px", padding: "10px" }}>
          <h4>{c.title}</h4>
          <p>Status: {c.status}</p>
          <p>Priority: {c.priority}</p>
        </div>
      ))}
    </div>
  );
}

export default MyComplaints;