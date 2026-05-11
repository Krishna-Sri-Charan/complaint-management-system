import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  CircularProgress,
} from "@mui/material";

import {
  FiberManualRecord,
} from "@mui/icons-material";

import { useParams } from "react-router-dom";

import API from "../../services/api";

import Layout from "../../components/Layout";

function ComplaintTimeline() {

  const { id } = useParams();

  const [updates, setUpdates] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetchTimeline();

  }, []);

  const fetchTimeline = async () => {

    try {

      const res = await API.get(`/complaints/${id}/updates`);

      setUpdates(res.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  return (
    <Layout>

      <Box sx={{ maxWidth: 900, margin: "0 auto" }}>

        <Typography
          variant="h4"
          fontWeight={800}
          mb={4}
        >
          Complaint Activity Timeline
        </Typography>

        {loading ? (

          <CircularProgress />

        ) : (

          <Stack spacing={2}>

            {updates.map((update, index) => (

              <Box
                key={update.id}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                }}
              >

                {/* TIMELINE LEFT */}

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mr: 3,
                  }}
                >

                  <FiberManualRecord
                    sx={{
                      color: "#6366F1",
                      fontSize: 18,
                    }}
                  />

                  {index !== updates.length - 1 && (

                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{
                        borderRightWidth: 2,
                        height: 80,
                        mt: 1,
                      }}
                    />
                  )}

                </Box>

                {/* TIMELINE CONTENT */}

                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    width: "100%",
                    border: "1px solid #E2E8F0",
                    mb: 2,
                  }}
                >

                  <Typography
                    variant="body1"
                    fontWeight={700}
                  >
                    {update.message}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="textSecondary"
                    mt={1}
                  >
                    {new Date(update.createdAt).toLocaleString()}
                  </Typography>

                  {update.updatedBy && (

                    <Typography
                      variant="caption"
                      color="#6366F1"
                      fontWeight={700}
                    >
                      Updated By: {update.updatedBy.name}
                    </Typography>
                  )}

                </Paper>

              </Box>

            ))}

          </Stack>

        )}

      </Box>

    </Layout>
  );
}

export default ComplaintTimeline;