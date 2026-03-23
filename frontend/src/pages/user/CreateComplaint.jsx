import { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function CreateComplaint() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      // TEMP: using userId = 1 (later from login)
      const res = await API.post(
        "/complaints?userId=1",
        form
      );

      alert(res.data.message);
      navigate("/dashboard");

    } catch (error) {
        console.log(error);
        console.log(error.response);
        alert("Failed to create complaint");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Create Complaint</h2>

      <input
        name="title"
        placeholder="Title"
        onChange={handleChange}
      />
      <br /><br />

      <textarea
        name="description"
        placeholder="Description"
        onChange={handleChange}
      />
      <br /><br />

      <button onClick={handleSubmit}>
        Submit Complaint
      </button>
    </div>
  );
}

export default CreateComplaint;