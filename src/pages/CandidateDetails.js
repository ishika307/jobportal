// src/pages/CandidateDetails.js

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit'; // Imported correctly

const theme = createTheme({
  palette: {
    mode: 'light', // Change to 'dark' if needed
  },
  typography: {
    fontFamily: '"Roboto Slab", serif',
  },
});

const CandidateDetails = () => {
  const { candidateId } = useParams(); // Retrieve candidateId from URL parameters
  const [candidate, setCandidate] = useState(null);
  const [status, setStatus] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const LOCAL_STORAGE_KEY_CANDIDATES = 'candidatesData';

  // Fetch candidate details from localStorage on component mount
  useEffect(() => {
    const candidatesFromStorage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_CANDIDATES)) || [];
    const foundCandidate = candidatesFromStorage.find((c) => c.id === candidateId);
    if (foundCandidate) {
      setCandidate(foundCandidate);
      setStatus(foundCandidate.status);
    }
  }, [candidateId]);

  // Handle status update
  const handleStatusUpdate = () => {
    if (!candidate) return;

    // Update candidate status in local component state
    setCandidate({ ...candidate, status });

    // Update candidate status in localStorage
    const allCandidates = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_CANDIDATES)) || [];
    const updatedAllCandidates = allCandidates.map((c) =>
      c.id === candidateId ? { ...c, status } : c
    );
    localStorage.setItem(LOCAL_STORAGE_KEY_CANDIDATES, JSON.stringify(updatedAllCandidates));

    setSnackbar({ open: true, message: 'Status updated successfully.', severity: 'success' });
  };

  // Handle Snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Define possible statuses
  const statusOptions = ['Under Review', 'Selected', 'Rejected', 'Interview Scheduled', 'Offer Made'];

  // Handle navigation back to Candidates page
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  if (!candidate) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="sm" sx={{ marginTop: 4 }}>
          <Typography variant="h6" align="center">
            Candidate not found.
          </Typography>
          <Box display="flex" justifyContent="center" mt={2}>
            <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={handleBack}>
              Back
            </Button>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ marginTop: 4, marginBottom: 4 }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
          Back
        </Button>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h4" gutterBottom>
            Candidate Details
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                value={candidate.name}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                value={candidate.email}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Job ID"
                value={candidate.jobId}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Application Date"
                value={candidate.applicationDate}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <Typography variant="h6" sx={{ mr: 2 }}>
                  Resume:
                </Typography>
                <Button
                  variant="contained"
                  component="a"
                  href="https://drive.google.com/uc?export=download&id=1pRazSkPgbbfviU3yDtjAZBxnXxdsWqSX"

                  startIcon={<ArrowBackIcon />} // You can choose a better icon
                >
                  Download Resume
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  label="Status"
                >
                  {statusOptions.map((statusOption) => (
                    <MenuItem key={statusOption} value={statusOption}>
                      {statusOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} display="flex" alignItems="center">             
                Update Status
              
            </Grid>
          </Grid>
        </Paper>

        {/* Snackbar for Notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default CandidateDetails;
