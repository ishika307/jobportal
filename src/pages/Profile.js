// src/pages/Profile.js

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Button,
  Paper
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Roboto Slab", serif',
    h4: { fontWeight: 700 },
    h6: { fontWeight: 500 },
    body1: { fontWeight: 400 },
  },
});

const Profile = () => {
  const adminData = {
    name: "Admin Name",
    jobTitle: "Company Administrator",
    email: "admin@example.com",
    phone: "+1 234 567 890",
    location: "New York, USA",
    recentActivities: ["Approved new job posting", "Updated team settings", "Added a new user"],
    permissions: ["User Management", "System Settings", "Report Access"],
    companyMetrics: {
      totalJobs: 35,
      totalCandidates: 120,
      openPositions: 5,
      interviewsScheduled: 20,
    },
  };
  const navigate = useNavigate();
  const handleBackToDashboard = () => {
    navigate('/');
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
  <Box display="flex" alignItems="center">
    <Avatar alt={adminData.name} sx={{ width: 80, height: 80, mr: 3 }}>
      {adminData.name[0]}
    </Avatar>
    <Box>
      <Typography variant="h4">{adminData.name}</Typography>
      <Typography variant="subtitle1">{adminData.jobTitle}</Typography>
    </Box>
  </Box>
  <Button variant="contained" color="primary" onClick={handleBackToDashboard}>
    Back to Dashboard
  </Button>
</Box>

        

        {/* Personal Information */}
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
          <Typography variant="h6" gutterBottom>Contact Information</Typography>
          <Typography variant="body1"><strong>Email:</strong> {adminData.email}</Typography>
          <Typography variant="body1"><strong>Phone:</strong> {adminData.phone}</Typography>
          <Typography variant="body1"><strong>Location:</strong> {adminData.location}</Typography>
        </Paper>

        

        

        {/* Company Metrics */}
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
          <Typography variant="h6" gutterBottom>Company Metrics</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Card>
                <CardContent>
                  <Typography variant="body1"><strong>Total Jobs:</strong></Typography>
                  <Typography variant="h5">{adminData.companyMetrics.totalJobs}</Typography>
                </CardContent>
              </Card>
            </Grid>   
            <Grid item xs={6}>
              <Card>
                <CardContent>
                  <Typography variant="body1"><strong>Open Positions:</strong></Typography>
                  <Typography variant="h5">{adminData.companyMetrics.openPositions}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default Profile;
