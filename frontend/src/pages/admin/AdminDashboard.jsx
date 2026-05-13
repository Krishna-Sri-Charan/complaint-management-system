import { useEffect, useState } from "react";
import { 
  Box, Typography, Card, CardContent, Button, 
  Stack, Chip, Grid, Divider, Dialog, 
  DialogTitle, DialogContent, DialogActions, TextField, MenuItem, InputAdornment
} from "@mui/material";
import { 
  AssignmentInd, Update, FilterList, 
  AdminPanelSettings, Engineering 
} from "@mui/icons-material";
import API from "../../services/api";
import Layout from "../../components/Layout";
import DashboardAnalytics from "../../components/DashboardAnalytics";
import SearchIcon from "@mui/icons-material/Search";

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'ASSIGN' or 'STATUS'
  const [selectedId, setSelectedId] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("OPEN");
  const [priority, setPriority] = useState("MEDIUM");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints");
      setComplaints(res.data.data.content);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenModal = (id, type) => {
    setSelectedId(id);
    setModalType(type);
    setInputValue("");
    setOpenModal(true);
  };

  const handleModalSubmit = async () => {
    try {
      if (modalType === "ASSIGN") {
        await API.put(`/admin/assign-technician?complaintId=${selectedId}&technicianId=${inputValue}`);
      } else {
        await API.put(`/admin/update-status?complaintId=${selectedId}&status=${inputValue}`);
      }
      setOpenModal(false);
      fetchComplaints();
    } catch (error) {
      alert("Action failed. Please check your inputs.");
    }
  };

  const searchComplaints = async () => {

    try {

      const res = await API.get(
        `/admin/search?keyword=${keyword}&status=${status}&priority=${priority}`
      );

      setComplaints(res.data.data);

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header Section */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b", display: 'flex', alignItems: 'center', gap: 1 }}>
              <AdminPanelSettings fontSize="large" color="primary" /> Admin Control Center
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Review and manage all incoming complaints.
            </Typography>
          </Box>
          <Button variant="outlined" startIcon={<FilterList />}>Filter</Button>
        </Stack>

        <Card
          sx={{
            mb: 4,
            borderRadius: 4,
            boxShadow: "none",
            border: "1px solid #E2E8F0",
          }}
        >
          <CardContent>

            <Grid container spacing={2}>

              {/* SEARCH */}

              <Grid item xs={12} md={4}>

                <TextField
                  fullWidth
                  placeholder="Search complaints..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />

              </Grid>

              {/* STATUS */}

              <Grid item xs={12} md={3}>

                <TextField
                  select
                  fullWidth
                  label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="OPEN">Open</MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="RESOLVED">Resolved</MenuItem>
                </TextField>

              </Grid>

              {/* PRIORITY */}

              <Grid item xs={12} md={3}>

                <TextField
                  select
                  fullWidth
                  label="Priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <MenuItem value="LOW">Low</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                </TextField>

              </Grid>

              {/* BUTTON */}

              <Grid item xs={12} md={2}>

                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    height: "56px",
                    borderRadius: 2,
                    bgcolor: "#4F46E5",
                  }}
                  onClick={searchComplaints}
                >
                  Search
                </Button>

              </Grid>

            </Grid>

          </CardContent>
        </Card>

        <DashboardAnalytics />

        <Grid container spacing={3}>
          {complaints.map((c) => (
            <Grid item xs={12} key={c.id}>
              <Card sx={{ 
                borderRadius: 4, 
                border: "1px solid #e2e8f0", 
                boxShadow: "none",
                "&:hover": { boxShadow: "0px 10px 20px rgba(0,0,0,0.05)" }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Grid container alignItems="center">
                    <Grid item xs={12} md={6}>
                      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                        <Chip label={c.status} color={c.status === 'RESOLVED' ? 'success' : 'primary'} size="small" sx={{ fontWeight: 700 }} />
                        <Chip label={c.priority} variant="outlined" size="small" sx={{ fontWeight: 700 }} />
                      </Stack>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{c.title}</Typography>
                      <Typography variant="body2" color="textSecondary">Complaint ID: #{c.id}</Typography>
                    </Grid>

                    <Grid item xs={12} md={6} sx={{ mt: { xs: 2, md: 0 } }}>
                      <Stack direction="row" spacing={2} justifyContent={{ md: "flex-end" }}>
                        <Button 
                          variant="contained" 
                          disableElevation
                          startIcon={<Engineering />}
                          onClick={() => handleOpenModal(c.id, "ASSIGN")}
                          sx={{ borderRadius: 2, bgcolor: "#4F46E5" }}
                        >
                          Assign Tech
                        </Button>
                        <Button 
                          variant="outlined" 
                          startIcon={<Update />}
                          onClick={() => handleOpenModal(c.id, "STATUS")}
                          sx={{ borderRadius: 2 }}
                        >
                          Update Status
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Action Dialog (Replaces prompt) */}
        <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="xs">
          <DialogTitle sx={{ fontWeight: 800 }}>
            {modalType === "ASSIGN" ? "Assign Technician" : "Update Complaint Status"}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              {modalType === "ASSIGN" ? (
                <TextField 
                  fullWidth 
                  label="Technician ID" 
                  variant="outlined" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              ) : (
                <TextField 
                  fullWidth 
                  select 
                  label="Select Status" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                >
                  <MenuItem value="OPEN">Open</MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="RESOLVED">Resolved</MenuItem>
                </TextField>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleModalSubmit} sx={{ borderRadius: 2 }}>
              Confirm Change
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}

export default AdminDashboard;