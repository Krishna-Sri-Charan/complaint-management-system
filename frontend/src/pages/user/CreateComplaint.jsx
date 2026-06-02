import { useState } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  Stack,
  MenuItem,
  Breadcrumbs,
  Link,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  Send,
  ArrowBack,
  AutoAwesome,
  LightbulbOutlined,
  CategoryOutlined,
  PriorityHighOutlined,
  GroupsOutlined,
  AttachFile,
  CheckCircleOutline,
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
    } finally {
      setError("");
    }
  };

  const analyzeComplaint = async () => {
    if (!form.description) {
      alert("Please enter complaint description");
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
    {
      value: "LOW",
      label: "Low — General Inquiry",
      color: "#6366f1",
      bg: "#eef2ff",
    },
    {
      value: "MEDIUM",
      label: "Medium — Performance Issue",
      color: "#d97706",
      bg: "#fef3c7",
    },
    {
      value: "HIGH",
      label: "High — Service Outage",
      color: "#dc2626",
      bg: "#fee2e2",
    },
  ];
  
  if (error) {
    return (
      <Layout>
        <ErrorMessage message={error} />
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ maxWidth: 780, margin: "0 auto" }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate("/dashboard")}
            sx={{ cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}
          >
            Dashboard
          </Link>
          <Typography color="text.primary" fontSize="0.85rem" fontWeight={600}>
            New Complaint
          </Typography>
        </Breadcrumbs>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            border: "1px solid #e2e8f0",
            overflow: "hidden",
            boxShadow: "0px 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          {/* Header Banner */}
          <Box
            sx={{
              p: { xs: 3, md: 4 },
              background: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)",
              color: "#fff",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: "15px",
                bgcolor: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                backdropFilter: "blur(4px)",
              }}
            >
              <Send sx={{ fontSize: 24, color: "#fff" }} />
            </Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, letterSpacing: "-0.5px", mb: 0.5 }}
            >
              Submit a Complaint
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
              Provide as much detail as possible so our team can help you quickly.
            </Typography>
          </Box>

          {/* Form Body */}
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={3}>
              {/* Title */}
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: "#475569",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    fontSize: "0.68rem",
                    display: "block",
                    mb: 1,
                  }}
                >
                  Complaint Title
                </Typography>
                <TextField
                  fullWidth
                  name="title"
                  placeholder="e.g., Wi-Fi not working in Hostel Block B"
                  variant="outlined"
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2.5,
                      "&:hover fieldset": { borderColor: "#6366f1" },
                      "&.Mui-focused fieldset": { borderColor: "#6366f1" },
                    },
                  }}
                />
              </Box>

              {/* Priority */}
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: "#475569",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    fontSize: "0.68rem",
                    display: "block",
                    mb: 1,
                  }}
                >
                  Priority Level
                </Typography>
                <TextField
                  fullWidth
                  select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2.5,
                      "&:hover fieldset": { borderColor: "#6366f1" },
                      "&.Mui-focused fieldset": { borderColor: "#6366f1" },
                    },
                  }}
                >
                  {priorityOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: opt.color,
                            flexShrink: 0,
                          }}
                        />
                        <Typography variant="body2" fontWeight={600}>
                          {opt.label}
                        </Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {/* Description */}
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: "#475569",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    fontSize: "0.68rem",
                    display: "block",
                    mb: 1,
                  }}
                >
                  Description
                </Typography>
                <TextField
                  fullWidth
                  name="description"
                  placeholder="Describe the issue in detail..."
                  multiline
                  rows={5}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2.5,
                      "&:hover fieldset": { borderColor: "#6366f1" },
                      "&.Mui-focused fieldset": { borderColor: "#6366f1" },
                    },
                  }}
                />
              </Box>

              {/* AI Actions */}
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: "#fafafa",
                  border: "1px solid #f1f5f9",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: "#475569",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    fontSize: "0.68rem",
                    display: "block",
                    mb: 2,
                  }}
                >
                  AI Assistant
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <Button
                    variant="contained"
                    onClick={analyzeComplaint}
                    disabled={aiLoading}
                    startIcon={
                      aiLoading ? (
                        <CircularProgress size={15} color="inherit" />
                      ) : (
                        <AutoAwesome sx={{ fontSize: 17 }} />
                      )
                    }
                    sx={{
                      bgcolor: "#7c3aed",
                      borderRadius: 2,
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      px: 2.5,
                      "&:hover": { bgcolor: "#6d28d9" },
                    }}
                  >
                    {aiLoading ? "Analyzing..." : "Analyze with AI"}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={generateSuggestions}
                    startIcon={<LightbulbOutlined sx={{ fontSize: 17 }} />}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      px: 2.5,
                      borderColor: "#c7d2fe",
                      color: "#6366f1",
                      "&:hover": { borderColor: "#6366f1", bgcolor: "#eef2ff" },
                    }}
                  >
                    Get Suggestions
                  </Button>
                </Stack>
              </Box>

              {/* AI Category Result */}
              {aiCategory && (
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    bgcolor: "#f5f3ff",
                    border: "1px solid #ddd6fe",
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <AutoAwesome sx={{ fontSize: 17, color: "#7c3aed" }} />
                    <Typography variant="subtitle2" fontWeight={800} color="#5b21b6">
                      AI Prediction
                    </Typography>
                  </Stack>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Box
                      sx={{
                        flex: 1,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "#fff",
                        border: "1px solid #ede9fe",
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                        <CategoryOutlined sx={{ fontSize: 16, color: "#7c3aed" }} />
                        <Typography variant="caption" fontWeight={700} color="#6b7280" textTransform="uppercase" letterSpacing="0.05em" fontSize="0.65rem">
                          Category
                        </Typography>
                      </Stack>
                      <Typography variant="body1" fontWeight={700} color="#1e1b4b">
                        {aiCategory}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        flex: 1,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "#fff",
                        border: "1px solid #ede9fe",
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                        <PriorityHighOutlined sx={{ fontSize: 16, color: "#7c3aed" }} />
                        <Typography variant="caption" fontWeight={700} color="#6b7280" textTransform="uppercase" letterSpacing="0.05em" fontSize="0.65rem">
                          Priority
                        </Typography>
                      </Stack>
                      <Typography variant="body1" fontWeight={700} color="#1e1b4b">
                        {priority}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              )}

              {/* AI Suggestions */}
              {suggestions && (
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    bgcolor: "#ecfdf5",
                    border: "1px solid #a7f3d0",
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <LightbulbOutlined sx={{ fontSize: 17, color: "#059669" }} />
                    <Typography variant="subtitle2" fontWeight={800} color="#065f46">
                      AI Troubleshooting Suggestions
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{ whiteSpace: "pre-line", color: "#065f46", lineHeight: 1.8 }}
                  >
                    {suggestions}
                  </Typography>
                  {recommendedTeam && (
                    <>
                      <Divider sx={{ my: 2, borderColor: "#a7f3d0" }} />
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <GroupsOutlined sx={{ fontSize: 16, color: "#047857" }} />
                        <Typography variant="body2" fontWeight={700} color="#047857">
                          Recommended Team:
                        </Typography>
                        <Chip
                          label={recommendedTeam}
                          size="small"
                          sx={{
                            bgcolor: "#d1fae5",
                            color: "#065f46",
                            fontWeight: 700,
                            borderRadius: "7px",
                            height: 22,
                            fontSize: "0.72rem",
                          }}
                        />
                      </Stack>
                    </>
                  )}
                </Box>
              )}

              {/* File Upload */}
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: "#475569",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    fontSize: "0.68rem",
                    display: "block",
                    mb: 1,
                  }}
                >
                  Attachment (Optional)
                </Typography>
                <Box
                  component="label"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 2,
                    border: "2px dashed #e2e8f0",
                    borderRadius: 2.5,
                    cursor: "pointer",
                    transition: "border-color 0.2s, background 0.2s",
                    "&:hover": { borderColor: "#6366f1", bgcolor: "#fafbff" },
                  }}
                >
                  <AttachFile sx={{ color: "#94a3b8", fontSize: 20 }} />
                  <Typography variant="body2" color={file ? "#0f172a" : "textSecondary"} fontWeight={file ? 600 : 400}>
                    {file ? file.name : "Click to attach a file"}
                  </Typography>
                  {file && <CheckCircleOutline sx={{ fontSize: 18, color: "#10b981", ml: "auto" }} />}
                  <input type="file" hidden onChange={(e) => setFile(e.target.files[0])} />
                </Box>
              </Box>

              {/* Action Buttons */}
              <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={() => navigate("/dashboard")}
                  sx={{
                    px: 3,
                    borderRadius: 2.5,
                    fontWeight: 700,
                    borderColor: "#e2e8f0",
                    color: "#64748b",
                    "&:hover": { borderColor: "#94a3b8", bgcolor: "#f8fafc" },
                  }}
                >
                  Back
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  endIcon={<Send />}
                  onClick={handleSubmit}
                  sx={{
                    py: 1.5,
                    fontWeight: 700,
                    borderRadius: 2.5,
                    bgcolor: "#4f46e5",
                    fontSize: "0.9rem",
                    boxShadow: "0 4px 14px rgba(79,70,229,0.4)",
                    "&:hover": { bgcolor: "#4338ca", boxShadow: "0 6px 20px rgba(79,70,229,0.5)" },
                  }}
                >
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