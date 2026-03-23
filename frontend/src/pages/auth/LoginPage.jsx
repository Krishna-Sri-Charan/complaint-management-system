import { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      alert(res.data.message);

      // Save user email (temporary, later JWT)
      localStorage.setItem("userEmail", email);

      navigate("/dashboard");

    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleLogin}>Login</button>
      
      <p>
        Don't have an account?{" "}
        <span onClick={() => navigate("/register")}>
            Register
        </span>
      </p>

      <button onClick={() => navigate("/admin-dashboard")}>
        Go to Admin Dashboard
      </button>
    </div>
  );
}

export default LoginPage;