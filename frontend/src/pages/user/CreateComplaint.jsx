import { useState } from "react";
import {
  Button, TextField, Box, Typography, Paper, Stack, 
  MenuItem, Breadcrumbs, Link, Chip, Divider, CircularProgress, Grid, Card
} from "@mui/material";
import {
  Send, ArrowBack, AutoAwesome, LightbulbOutlined, 
  CategoryOutlined, PriorityHighOutlined, GroupsOutlined, 
  AttachFile, CheckCircleOutline
} from "@mui/icons-material";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import ErrorMessage from "../../components/ErrorMessage";

function CreateComplaint() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "LOW",
  });
  const [file, setFile] = useState(null);
  const [aiCategory, setAiCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [suggestions, setSuggestions] = useState("");
  const [recommendedTeam, setRecommendedTeam] = useState("");
  const [error, setError] = useState("");

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
      formData.append("userPriority", form.priority);
      if (file) formData.append("file", file);

      const res = await API.post("/complaints", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("cms_token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert(res.data.message);
      navigate("/dashboard");
    } catch (error) {
      setError("Failed to create complaint");
    }
  };

  const analyzeComplaint = async () => {
    if (!form.description) {
      alert("Please enter a complaint description first.");
      return;
    }
    try {
      setAiLoading(true);
      const res = await API.post("/ai/analyze", form.description, {
        headers: { "Content-Type": "text/plain" },
      });
      setAiCategory(res.data.data.category);
      setPriority(res.data.data.priority);
    } catch (error) {
      console.log(error);
      alert("AI analysis failed");
    } finally {
      setAiLoading(false);
    }
  };

  const generateSuggestions = async () => {
    if (!form.description) {
      alert("Please enter a complaint description first.");
      return;
    }
    try {
      const res = await API.post("/ai/suggestions", form.description, {
        headers: { "Content-Type": "text/plain" },
      });
      setSuggestions(res.data.data.suggestions);
      setRecommendedTeam(res.data.data.recommendedTeam);
    } catch (error) {
      console.log(error);
    }
  };

  const priorityOptions = [
    { value: "LOW", label: "Low — General Inquiry", color: "#6366f1", bg: "#eef2ff" },
    { value: "MEDIUM", label: "Medium — Performance Issue", color: "#d97706", bg: "#fffbeb" },
    { value: "HIGH", label: "High — Service Outage", color: "#dc2626", bg: "#fee2e2" },
  ];
  
  if (error) return <Layout><ErrorMessage message={error} /></Layout>;

  return (
    <Layout>
      <Box sx={{ maxWidth: 780, margin: "0 auto", px: { xs: 1, sm: 2 } }}>
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link underline="hover" color="inherit" onClick={() => navigate("/dashboard")} sx={{ cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>
            Dashboard
          </Link>
          <Typography color="text.primary" fontSize="0.85rem" fontWeight={600}>
            New Complaint
          </Typography>
        </Breadcrumbs>

        <Paper elevation={0} sx={{ borderRadius: 4, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0px 10px 30px rgba(0,0,0,0.03)" }}>
          <Box sx={{ p: { xs: 3, md: 4 }, background: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)", color: "#fff", textAlign: "center", borderBottom: "1px solid #334155" }}>
            {/* <Box sx={{ width: 52, height: 52, borderRadius: "15px", bgcolor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", backdropFilter: "blur(4px)" }}>
              <Send sx={{ fontSize: 22, color: "#818cf8" }} />
            </Box> */}
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.5px", mb: 0.5 }}>
              File a System Complaint
            </Typography>
            <Typography variant="body2" sx={{ color: "#94a3b8" }}>
              Provide structured parameters below. Clear logs allow engineering agents to target resolutions promptly.
            </Typography>
          </Box>

          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={3.5}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.68rem", display: "block", mb: 1 }}>
                  Complaint Title
                </Typography>
                <TextField fullWidth name="title" placeholder="e.g., Campus Wi-Fi outage in library reading hall" variant="outlined" onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }} />
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.68rem", display: "block", mb: 1 }}>
                  Priority Override Level
                </Typography>
                <TextField fullWidth select name="priority" value={form.priority} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}>
                  {priorityOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: opt.color, flexShrink: 0 }} />
                        <Typography variant="body2" fontWeight={600} color="#1e293b">{opt.label}</Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.68rem", display: "block", mb: 1 }}>
                  Core Problem Statement Description
                </Typography>
                <TextField fullWidth name="description" placeholder="Describe environmental conditions, specific hardware identifiers, or unexpected crash outputs..." multiline rows={5} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }} />
              </Box>

              {/* Enhanced AI Assistant Engine Dashboard View */}
              <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <AutoAwesome sx={{ fontSize: 16, color: "#6366f1" }} />
                  <Typography variant="caption" sx={{ fontWeight: 800, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.68rem" }}>
                    ResolveFlow AI Optimization Suite
                  </Typography>
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <Button
                    variant="contained" disableElevation onClick={analyzeComplaint} disabled={aiLoading}
                    startIcon={aiLoading ? <CircularProgress size={14} color="inherit" /> : <AutoAwesome sx={{ fontSize: 15 }} />}
                    sx={{ bgcolor: "#6366f1", borderRadius: "8px", fontWeight: 600, fontSize: "0.8rem", textTransform: "none", px: 3, "&:hover": { bgcolor: "#4f46e5" } }}
                  >
                    {aiLoading ? "Analyzing Statement..." : "Predict Category & Priority"}
                  </Button>
                  <Button
                    variant="outlined" onClick={generateSuggestions}
                    startIcon={<LightbulbOutlined sx={{ fontSize: 16 }} />}
                    sx={{ borderRadius: "8px", fontWeight: 600, fontSize: "0.8rem", textTransform: "none", px: 3, borderColor: "#cbd5e1", color: "#475569", "&:hover": { borderColor: "#94a3b8", bgcolor: "#fff" } }}
                  >
                    Fetch AI Troubleshooting Guidelines
                  </Button>
                </Stack>
              </Box>

              {/* Symmetrical AI Prediction Cards */}
              {aiCategory && (
                <Box sx={{ p: 3, borderRadius: 3, bgcolor: "#f5f3ff", border: "1px solid #c7d2fe", position: "relative" }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <AutoAwesome sx={{ fontSize: 16, color: "#6366f1" }} />
                    <Typography variant="subtitle2" fontWeight={800} color="#4338ca">AI Routing Diagnostic Outputs</Typography>
                  </Stack>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex" }}>
                      <Card sx={{ width: "100%", p: 2, borderRadius: 2, border: "1px solid #ddd6fe", boxShadow: "none" }}>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                          <CategoryOutlined sx={{ fontSize: 15, color: "#6366f1" }} />
                          <Typography variant="caption" fontWeight={700} color="#64748b" textTransform="uppercase" fontSize="0.65rem">Identified Stream Category</Typography>
                        </Stack>
                        <Typography variant="body1" fontWeight={800} color="#1e1b4b">{aiCategory}</Typography>
                      </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex" }}>
                      <Card sx={{ width: "100%", p: 2, borderRadius: 2, border: "1px solid #ddd6fe", boxShadow: "none" }}>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                          <PriorityHighOutlined sx={{ fontSize: 15, color: "#6366f1" }} />
                          <Typography variant="caption" fontWeight={700} color="#64748b" textTransform="uppercase" fontSize="0.65rem">Calculated Severity Urgency</Typography>
                        </Stack>
                        <Typography variant="body1" fontWeight={800} color="#1e1b4b">{priority}</Typography>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* AI Recommendations Panel */}
              {suggestions && (
                <Box sx={{ p: 3, borderRadius: 3, bgcolor: "#ecfdf5", border: "1px solid #a7f3d0" }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <LightbulbOutlined sx={{ fontSize: 17, color: "#10b981" }} />
                    <Typography variant="subtitle2" fontWeight={800} color="#065f46">AI Assisted Local Remediation Suggestions</Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-line", color: "#065f46", lineHeight: 1.7, mb: recommendedTeam ? 2 : 0 }}>
                    {suggestions}
                  </Typography>
                  {recommendedTeam && (
                    <>
                      <Divider sx={{ my: 2, borderColor: "#a7f3d0" }} />
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <GroupsOutlined sx={{ fontSize: 16, color: "#047857" }} />
                        <Typography variant="body2" fontWeight={700} color="#047857">Suggested Escalation Channel:</Typography>
                        <Chip label={recommendedTeam} size="small" sx={{ bgcolor: "#d1fae5", color: "#065f46", fontWeight: 700, borderRadius: "6px", border: "1px solid #6ee7b7" }} />
                      </Stack>
                    </>
                  )}
                </Box>
              )}

              {/* File Upload Boundary */}
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.68rem", display: "block", mb: 1 }}>
                  Verification Attachment (Optional)
                </Typography>
                <Box
                  component="label"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 2,
                    border: "2px dashed #cbd5e1",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                    bgcolor: "#fff",
                    "&:hover": { borderColor: "#6366f1", bgcolor: "#f8fafc" },
                  }}
                >
                  <AttachFile sx={{ color: "#64748b", fontSize: 20 }} />
                  <Typography variant="body2" color={file ? "#0f172a" : "textSecondary"} fontWeight={file ? 700 : 500}>
                    {file ? file.name : "Choose logs file, diagnostic screenshot, or document archive..."}
                  </Typography>
                  {file && <CheckCircleOutline sx={{ fontSize: 18, color: "#10b981", ml: "auto" }} />}
                  <input type="file" hidden onChange={(e) => setFile(e.target.files[0])} />
                </Box>
              </Box>

              {/* Terminal Form Footer Options */}
              <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate("/dashboard")} sx={{ px: 3, borderRadius: "8px", fontWeight: 600, color: "#475569", borderColor: "#cbd5e1", textTransform: "none" }}>
                  Back
                </Button>
                <Button fullWidth variant="contained" disableElevation endIcon={<Send />} onClick={handleSubmit} sx={{ py: 1.2, fontWeight: 700, borderRadius: "8px", bgcolor: "#4f46e5", fontSize: "0.85rem", textTransform: "none", "&:hover": { bgcolor: "#1e293b" } }}>
                  Submit Complaint
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
}

export default CreateComplaint;