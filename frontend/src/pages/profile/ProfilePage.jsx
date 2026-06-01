import { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Alert
} from "@mui/material";

import Layout from "../../components/Layout";
import API from "../../services/api";

function ProfilePage() {

  const [profile, setProfile] =
    useState({
      name: "",
      email: "",
      role: ""
    });

  const [passwordData, setPasswordData] =
    useState({
      oldPassword: "",
      newPassword: ""
    });

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {

    fetchProfile();

  }, []);

  const fetchProfile = async () => {

    try {

      const res =
        await API.get(
          "/users/profile"
        );

      setProfile(
        res.data.data
      );

    } catch (error) {

      console.log(error);
    }
  };

  const updateProfile =
    async () => {

      try {

        await API.put(
          "/users/profile",
          {
            name:
              profile.name,

            email:
              profile.email
          }
        );

        setSuccessMessage(
          "Profile updated successfully"
        );

        setErrorMessage("");

      } catch (error) {

        setErrorMessage(
          "Failed to update profile"
        );
      }
    };

  const changePassword =
    async () => {

      try {

        await API.post(
          "/users/change-password",
          passwordData
        );

        setSuccessMessage(
          "Password changed successfully"
        );

        setErrorMessage("");

        setPasswordData({
          oldPassword: "",
          newPassword: ""
        });

      } catch (error) {

        setErrorMessage(
          "Failed to change password"
        );
      }
    };

  return (

    <Layout>

      <Box
        sx={{
          maxWidth: 900,
          mx: "auto"
        }}
      >

        <Typography
          variant="h4"
          fontWeight={800}
          mb={3}
        >
          My Profile
        </Typography>

        {successMessage && (

          <Alert
            severity="success"
            sx={{ mb: 2 }}
          >
            {successMessage}
          </Alert>

        )}

        {errorMessage && (

          <Alert
            severity="error"
            sx={{ mb: 2 }}
          >
            {errorMessage}
          </Alert>

        )}

        <Grid
          container
          spacing={3}
        >

          <Grid
            item
            xs={12}
          >

            <Card
              sx={{
                borderRadius: 4
              }}
            >

              <CardContent>

                <Typography
                  variant="h6"
                  fontWeight={700}
                  mb={3}
                >
                  Profile Information
                </Typography>

                <Grid
                  container
                  spacing={2}
                >

                  <Grid
                    item
                    xs={12}
                    md={6}
                  >

                    <TextField
                      fullWidth
                      label="Name"
                      value={
                        profile.name
                      }
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          name:
                            e.target.value
                        })
                      }
                    />

                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                  >

                    <TextField
                      fullWidth
                      label="Email"
                      value={
                        profile.email
                      }
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          email:
                            e.target.value
                        })
                      }
                    />

                  </Grid>

                  <Grid
                    item
                    xs={12}
                  >

                    <TextField
                      fullWidth
                      label="Role"
                      value={
                        profile.role
                      }
                      disabled
                    />

                  </Grid>

                </Grid>

                <Button
                  variant="contained"
                  sx={{
                    mt: 3
                  }}
                  onClick={
                    updateProfile
                  }
                >
                  Update Profile
                </Button>

              </CardContent>

            </Card>

          </Grid>

          <Grid
            item
            xs={12}
          >

            <Card
              sx={{
                borderRadius: 4
              }}
            >

              <CardContent>

                <Typography
                  variant="h6"
                  fontWeight={700}
                  mb={3}
                >
                  Change Password
                </Typography>

                <Grid
                  container
                  spacing={2}
                >

                  <Grid
                    item
                    xs={12}
                  >

                    <TextField
                      fullWidth
                      type="password"
                      label="Old Password"
                      value={
                        passwordData.oldPassword
                      }
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          oldPassword:
                            e.target.value
                        })
                      }
                    />

                  </Grid>

                  <Grid
                    item
                    xs={12}
                  >

                    <TextField
                      fullWidth
                      type="password"
                      label="New Password"
                      value={
                        passwordData.newPassword
                      }
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword:
                            e.target.value
                        })
                      }
                    />

                  </Grid>

                </Grid>

                <Button
                  variant="contained"
                  color="secondary"
                  sx={{
                    mt: 3
                  }}
                  onClick={
                    changePassword
                  }
                >
                  Change Password
                </Button>

              </CardContent>

            </Card>

          </Grid>

        </Grid>

      </Box>

    </Layout>
  );
}

export default ProfilePage;