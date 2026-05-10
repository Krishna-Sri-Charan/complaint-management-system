import { useEffect, useState } from "react";
import { 
  Box, Typography, Card, CardContent, Button, 
  Stack, Chip, Grid, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, MenuItem,
  List, ListItem, ListItemText, Divider
} from "@mui/material";
import { 
  Build, Update, RateReview, 
  AssignmentLate, CheckCircle 
} from "@mui/icons-material";
import API from "../../services/api";
import Layout from "../../components/Layout";

function TechnicianDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'STATUS' or 'NOTE'
  const [selectedId, setSelectedId] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const TECH_ID = 4; // Temporary hardcoded ID

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await API.get(`/technician/complaints?technicianId=${TECH_ID}`);
      setComplaints(res.data || []);
    } catch (error) {
      console.log(error);
      setComplaints([]);
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
      if (modalType === "STATUS") {
        await API.put(`/technician/update-status?complaintId=${selectedId}&status=${inputValue}`);
      } else {
        await API.post(`/technician/add-update?complaintId=${selectedId}&technicianId=${TECH_ID}&message=${inputValue}`);
      }
      setOpenModal(false);
      fetchComplaints();
    } catch (error) {
      alert("Action failed. Please try again.");
    }
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b", mb: 1 }}>
            Technician Workspace
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage your assigned tasks and provide progress updates.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {complaints.length === 0 ? (
            <Box sx={{ width: '100%', textAlign: 'center', mt: 10 }}>
              <CheckCircle sx={{ fontSize: 60, color: '#10b981', mb: 2 }} />
              <Typography variant="h6">No assigned complaints. Great job!</Typography>
            </Box>
          ) : (
            complaints.map((c) => (
              <Grid item xs={12} key={c.id}>
                <Card sx={{ 
                  borderRadius: 4, 
                  border: "1px solid #e2e8f0", 
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.02)" 
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={7}>
                        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                          <Chip 
                            label={c.status} 
                            color={c.status === 'RESOLVED' ? 'success' : 'warning'} 
                            variant="filled" 
                            size="small" 
                            sx={{ fontWeight: 700 }} 
                          />
                          <Chip 
                            label={c.priority} 
                            variant="outlined" 
                            size="small" 
                            sx={{ fontWeight: 700, borderColor: c.priority === 'HIGH' ? '#ef4444' : '#e2e8f0' }} 
                          />
                        </Stack>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                          {c.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {c.description}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={5}>
                        <Stack direction="column" spacing={2} sx={{ height: '100%', justifyContent: 'center' }}>
                          <Button 
                            variant="contained" 
                            startIcon={<Update />}
                            onClick={() => handleOpenModal(c.id, "STATUS")}
                            sx={{ borderRadius: 2, py: 1, bgcolor: "#4F46E5" }}
                          >
                            Update Status
                          </Button>
                          <Button 
                            variant="outlined" 
                            startIcon={<RateReview />}
                            onClick={() => handleOpenModal(c.id, "NOTE")}
                            sx={{ borderRadius: 2, py: 1 }}
                          >
                            Add Work Note
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {/* Modal for Status or Notes */}
        <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="xs">
          <DialogTitle sx={{ fontWeight: 800 }}>
            {modalType === "STATUS" ? "Change Status" : "Add Work Note"}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              {modalType === "STATUS" ? (
                <TextField 
                  fullWidth select label="Status" 
                  value={inputValue} 
                  onChange={(e) => setInputValue(e.target.value)}
                >
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="RESOLVED">Resolved</MenuItem>
                </TextField>
              ) : (
                <TextField 
                  fullWidth multiline rows={4} 
                  label="Note Message" 
                  placeholder="Describe the work done so far..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleModalSubmit} sx={{ borderRadius: 2 }}>
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}

export default TechnicianDashboard;