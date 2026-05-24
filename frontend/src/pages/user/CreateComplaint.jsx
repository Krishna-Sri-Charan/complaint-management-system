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
  const [file, setFile] = useState(null);
  const [aiCategory, setAiCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [suggestions, setSuggestions] = useState("");
  const [recommendedTeam, setRecommendedTeam] = useState("");
  const user = JSON.parse(localStorage.getItem("cms_user"));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {

    try {

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("aiCategory", aiCategory);
      formData.append("aiPriority", priority);
      formData.append("userPriority",form.priority);

      if (file) {
        formData.append("file", file);
      }

      const res = await API.post(
        "/complaints",
        formData,
        {
  headers: {
    Authorization:
      `Bearer ${
        localStorage.getItem("cms_token")
      }`,
    "Content-Type": "multipart/form-data",
  },
}
      );

      alert(res.data.message);

      navigate("/dashboard");

    } catch (error) {

      alert("Failed to create complaint");
    }
  };

  const analyzeComplaint = async () => {

    if (!form.description) {

      alert("Please enter complaint description");

      return;
    }

    try {

      setAiLoading(true);

      const res = await API.post(
        "/ai/analyze",
        form.description,
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );

      setAiCategory(
        res.data.data.category
      );

      setPriority(
        res.data.data.priority
      );

    } catch (error) {

      console.log(error);

      alert("AI analysis failed");

    } finally {

      setAiLoading(false);
    }
  };

  const generateSuggestions = async () => {

    try {

      const res = await API.post(
        "/ai/suggestions",
        form.description,
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );

      setSuggestions(
        res.data.data.suggestions
      );

      setRecommendedTeam(
        res.data.data.recommendedTeam
      );

    } catch (error) {

      console.log(error);
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

            <Button
              variant="contained"
              onClick={analyzeComplaint}
              disabled={aiLoading}
              sx={{
                mt: 2,
                mb: 3,
                bgcolor: "#7C3AED",
                borderRadius: 2,
              }}
            >

              {aiLoading
                ? "Analyzing..."
                : "Analyze with AI"}

            </Button>

            {aiCategory && (

              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: "#F5F3FF",
                  border: "1px solid #DDD6FE",
                  mb: 3,
                }}
              >

                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                >
                  AI Prediction
                </Typography>

                <Typography>
                  Category:
                  <strong> {aiCategory}</strong>
                </Typography>

                <Typography>
                  Priority:
                  <strong> {priority}</strong>
                </Typography>

              </Box>
            )}

            <Button
              variant="outlined"
              sx={{
                ml: 2,
                mt: 2,
                mb: 3,
                borderRadius: 2,
              }}
              onClick={generateSuggestions}
            >

              Get AI Suggestions

            </Button>

            {suggestions && (

            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: "#ECFDF5",
                border: "1px solid #A7F3D0",
                mb: 3,
              }}
            >

              <Typography
                variant="subtitle1"
                fontWeight={700}
                mb={1}
              >
                AI Troubleshooting Suggestions
              </Typography>

              <Typography
                sx={{
                  whiteSpace: "pre-line",
                }}
              >
                {suggestions}
              </Typography>

              <Typography
                mt={2}
                fontWeight={700}
                color="#047857"
              >
                Recommended Team:
                {" "}
                {recommendedTeam}
              </Typography>

            </Box>
          )}

            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
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