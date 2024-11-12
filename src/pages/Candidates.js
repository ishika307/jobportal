// src/pages/Candidates.js

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Button,
  Box,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility'; // Import VisibilityIcon
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';

// Sample candidate data to add to local storage
const sampleCandidates = [
  {
    id: "1",
    jobId: "PLACEHOLDER_JOB_ID", // Placeholder for Job ID
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    applicationDate: "2024-01-10",
    status: "Under Review",
    resume: "https://drive.google.com/file/d/1pRazSkPgbbfviU3yDtjAZBxnXxdsWqSX/view?usp=drive_link"
  },
  {
    id: "2",
    jobId: "PLACEHOLDER_JOB_ID", // Placeholder for Job ID
    name: "Bob Smith",
    email: "bob.smith@example.com",
    resume: "/path/to/bob_smith_resume.pdf",
    applicationDate: "2024-01-12",
    status: "Selected"
  },
  {
    id: "3",
    jobId: "PLACEHOLDER_JOB_ID", // Placeholder for Job ID
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    resume: "/path/to/charlie_brown_resume.pdf",
    applicationDate: "2024-01-15",
    status: "Rejected"
  }
];

// Function to initialize local storage with the correct job ID
const initializeCandidatesData = (jobId) => {
  const updatedCandidates = sampleCandidates.map(candidate => ({
    ...candidate,
    jobId: jobId, // Assign the passed jobId dynamically
  }));

  // Store updated candidates only if localStorage is empty to prevent overwriting
  if (!localStorage.getItem("candidatesData")) {
    localStorage.setItem("candidatesData", JSON.stringify(updatedCandidates));
  }
};

// Theme definition
const theme = createTheme({
  palette: {
    mode: 'light',
  },
  typography: {
    fontFamily: '"Roboto Slab", serif',
  },
});

const Candidates = () => {
  const { jobId } = useParams(); // Retrieve jobId from URL parameters
  const [candidates, setCandidates] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const LOCAL_STORAGE_KEY_CANDIDATES = 'candidatesData';

  // Initialize candidates data with the given job ID if not already set
  useEffect(() => {
    initializeCandidatesData(jobId);
  }, [jobId]);

  // Fetch and filter candidates by jobId from localStorage on component mount
  useEffect(() => {
    const candidatesFromStorage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_CANDIDATES)) || [];
    const filteredCandidates = candidatesFromStorage.filter((candidate) => candidate.jobId === jobId);
    setCandidates(filteredCandidates);
  }, [jobId]);

  // Handle status change
  const handleStatusChange = (event, candidateId) => {
    const newStatus = event.target.value;
    const updatedCandidates = candidates.map((candidate) =>
      candidate.id === candidateId ? { ...candidate, status: newStatus } : candidate
    );
    setCandidates(updatedCandidates);

    // Update the main candidates list in localStorage
    const allCandidates = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_CANDIDATES)) || [];
    const updatedAllCandidates = allCandidates.map((candidate) =>
      candidate.id === candidateId ? { ...candidate, status: newStatus } : candidate
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

  // Optional: Add a button to navigate back to Dashboard
  const handleBackToDashboard = () => {
    navigate('/');
  };

  // Handle navigation to Candidate Details
  const handleViewDetails = (candidateId) => {
    navigate(`/candidates/${candidateId}`);
  };

  console.log(candidates);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ marginTop: 4, marginBottom: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" gutterBottom>
            Candidates for Job ID: {jobId}
          </Typography>
          <Button variant="contained" color="primary" onClick={handleBackToDashboard}>
            Back to Dashboard
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table aria-label="candidates table">
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Resume</strong></TableCell>
                <TableCell><strong>Application Date</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell> {/* New Actions Column */}
              </TableRow>
            </TableHead>
            <TableBody>
              {candidates.length > 0 ? (
                candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>{candidate.name}</TableCell>
                    <TableCell>{candidate.email}</TableCell>
                    <TableCell>
                      <IconButton
                        component="a"
                        href="https://drive.google.com/uc?export=download&id=1pRazSkPgbbfviU3yDtjAZBxnXxdsWqSX"

                        download
                        color="primary"
                        aria-label={`Download resume of ${candidate.name}`}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>{candidate.applicationDate}</TableCell>
                    <TableCell>
                      <FormControl variant="standard" fullWidth>
                        <InputLabel id={`status-label-${candidate.id}`}>Status</InputLabel>
                        <Select
                          labelId={`status-label-${candidate.id}`}
                          id={`status-select-${candidate.id}`}
                          value={candidate.status}
                          onChange={(e) => handleStatusChange(e, candidate.id)}
                          label="Status"
                        >
                          {statusOptions.map((status) => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="secondary"
                        aria-label={`View details of ${candidate.name}`}
                        onClick={() => handleViewDetails(candidate.id)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No candidates found for this job.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

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

export default Candidates;
