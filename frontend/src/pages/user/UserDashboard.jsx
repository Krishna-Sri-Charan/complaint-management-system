import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "40px" }}>
      <h2>User Dashboard</h2>

      <button onClick={() => navigate("/create-complaint")}>
        Create Complaint
      </button>

      <br /><br />

      <button onClick={() => navigate("/my-complaints")}>
        View My Complaints
      </button>
    </div>
  );
}

export default UserDashboard;