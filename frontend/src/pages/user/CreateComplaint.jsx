import { useState } from "react";
import { 
  Button, TextField, Box, Typography, Paper, 
  Stack, MenuItem, Breadcrumbs, Link 
} from "@mui/material";
import { Send, ArrowBack } from "@mui/icons-material";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";

function CreateComplaint() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "LOW" // Adding a default priority
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await API.post("/complaints?userId=1", form);
      navigate("/dashboard");
    } catch (error) {
      alert("Failed to create complaint");
    }
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link underline="hover" color="inherit" onClick={() => navigate("/dashboard")} sx={{ cursor: 'pointer' }}>
            Dashboard
          </Link>
          <Typography color="text.primary">New Complaint</Typography>
        </Breadcrumbs>

        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: "1px solid #e2e8f0" }}>
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>
              Submit a Complaint
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Provide as much detail as possible so our team can help you quickly.
            </Typography>
          </Box>

          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Complaint Title"
              name="title"
              placeholder="e.g., Wi-Fi not working in Hostel Block B"
              variant="outlined"
              onChange={handleChange}
            />

            <TextField
              fullWidth
              select
              label="Priority Level"
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <MenuItem value="LOW">Low - General Inquiry</MenuItem>
              <MenuItem value="MEDIUM">Medium - Performance Issue</MenuItem>
              <MenuItem value="HIGH">High - Service Outage</MenuItem>
            </TextField>

            <TextField
              fullWidth
              label="Description"
              name="description"
              placeholder="Describe the issue in detail..."
              multiline
              rows={5}
              onChange={handleChange}
            />

            <Box sx={{ display: "flex", gap: 2, pt: 2 }}>
              <Button 
                variant="outlined" 
                startIcon={<ArrowBack />} 
                onClick={() => navigate("/dashboard")}
                sx={{ px: 4, borderRadius: 2 }}
              >
                Back
              </Button>
              <Button 
                fullWidth 
                variant="contained" 
                endIcon={<Send />} 
                onClick={handleSubmit}
                sx={{ py: 1.5, fontWeight: 700, borderRadius: 2, bgcolor: "#4F46E5" }}
              >
                Submit Complaint
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Layout>
  );
}

export default CreateComplaint;