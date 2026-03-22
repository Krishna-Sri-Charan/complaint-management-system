import { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const res = await API.post("/auth/register", form);

      alert(res.data.message);
      navigate("/");

    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h2>Register</h2>

      <input
        name="name"
        placeholder="Name"
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />
      <br /><br />

      <select name="role" onChange={handleChange}>
        <option value="USER">User</option>
        <option value="TECHNICIAN">Technician</option>
        <option value="ADMIN">Admin</option>
      </select>

      <br /><br />

      <button onClick={handleRegister}>Register</button>

      <p>
        Already have an account?{" "}
        <span onClick={() => navigate("/")}>
          Login
        </span>
      </p>
    </div>
  );
}

export default RegisterPage;