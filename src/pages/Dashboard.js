// src/pages/Dashboard.js

import React, { useEffect, useState } from 'react';
import {Selct, MenuItem, InputLabel, FormControl,Select} from '@mui/material';
import {
  Grid, Card, CardContent, CardActions, Typography, Button,
  Tooltip, IconButton, Box, Container, Snackbar, Alert, AppBar, 
  InputAdornment, Toolbar, Badge, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GroupIcon from '@mui/icons-material/Group';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Zoom from '@mui/material/Zoom';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from 'recharts';

const theme = createTheme({
  typography: {
    fontFamily: '"Roboto Slab", serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 500 },
    body1: { fontWeight: 400 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  palette: {
    primary: { main: '#1976D2' },
    secondary: { main: '#DC004E' },
    success: { main: '#4caf50' },
    error: { main: '#f44336' },
    warning: { main: '#ff9800' },
    info: { main: '#2196f3' },
  },
});

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[6],
  },
}));

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [jobToEdit, setJobToEdit] = useState({ id: '', title: '', description: '' });
  const [openAddDialog, setOpenAddDialog] = useState(false); // Controls Add Job Dialog
  const [newJob, setNewJob] = useState({ title: '', description: '', jobId:'' }); // Holds new job data
  const navigate = useNavigate();

  const LOCAL_STORAGE_KEY_JOBS = 'jobsData';
  const LOCAL_STORAGE_KEY_CANDIDATES = 'candidatesData';

  useEffect(() => {
    const jobsFromStorage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_JOBS)) || [];
    setJobs(jobsFromStorage);
    const candidatesFromStorage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_CANDIDATES)) || [];
    setCandidates(candidatesFromStorage);
  }, []);
  console.log(candidates);
  

  const handleViewCandidates = (jobId) => {
    navigate(`/candidates/${jobId}`);
  };

  const handleDeleteJob = (jobId) => {
    const updatedJobs = jobs.filter((job) => job.id !== jobId);
    setJobs(updatedJobs);
    localStorage.setItem(LOCAL_STORAGE_KEY_JOBS, JSON.stringify(updatedJobs));
    setSnackbar({ open: true, message: 'Job deleted successfully.', severity: 'info' });
  };

  const handleEditJob = (job) => {
    setJobToEdit(job);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setJobToEdit({ id: '', title: '', description: '' });
  };

  const handleSaveJobEdit = () => {
    if (!jobToEdit.title.trim()) {
      setSnackbar({ open: true, message: 'Job title cannot be empty.', severity: 'error' });
      return;
    }

    const updatedJobs = jobs.map((job) =>
      job.id === jobToEdit.id ? { ...job, title: jobToEdit.title.trim(), description: jobToEdit.description.trim() } : job
    );
    setJobs(updatedJobs);
    localStorage.setItem(LOCAL_STORAGE_KEY_JOBS, JSON.stringify(updatedJobs));
    setSnackbar({ open: true, message: 'Job updated successfully.', severity: 'success' });
    handleCloseEditDialog();
  };

  const handleOpenAddJobDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddJobDialog = () => {
    setOpenAddDialog(false);
    setNewJob({ title: '', description: '' });
  };

  const handleAddJob = () => {
    if (!newJob.title.trim()) {
      setSnackbar({ open: true, message: 'Job title cannot be empty.', severity: 'error' });
      return;
    }

    const newJobData = {
      ...newJob,
      id: new Date().getTime().toString(),
    };
    const updatedJobs = [...jobs, newJobData];
    setJobs(updatedJobs);
    localStorage.setItem(LOCAL_STORAGE_KEY_JOBS, JSON.stringify(updatedJobs));
    setSnackbar({ open: true, message: 'Job added successfully.', severity: 'success' });
    handleCloseAddJobDialog();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalJobs = jobs.length;
  const totalCandidates = candidates.length;

  const chartData = jobs.map((job) => ({
    name: job.title,
    Candidates: candidates.filter((candidate) => candidate.jobId === job.id).length,
  }));
  console.log(jobs.id);

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" sx={{ marginBottom: 4 }}>
        <Toolbar>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Button color="inherit" onClick={() => navigate('/profile')}>
            Profile
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl">
        <Grid container spacing={4} sx={{ marginBottom: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ padding: 2, backgroundColor: theme.palette.primary.main, color: '#fff', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h5">{totalJobs}</Typography>
                <Typography variant="subtitle1">Total Jobs</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ padding: 2, backgroundColor: theme.palette.success.main, color: '#fff', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h5">{totalCandidates}</Typography>
                <Typography variant="subtitle1">Total Candidates</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 2 }}>
          <Grid item xs={12} md={6}>
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Search Jobs"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} textAlign={{ xs: 'left', md: 'right' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              onClick={handleOpenAddJobDialog}
              sx={{ fontSize: '1rem' }}
            >
              Add New Job
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job,index) => (
              <Grid item xs={12} sm={6} md={4} key={job.id}>
                <StyledCard>
                  <CardContent>
                    <Tooltip title={job.description} arrow TransitionComponent={Zoom} TransitionProps={{ timeout: 600 }}>
                      <Typography variant="h6" gutterBottom>
                        {job.title}
                      </Typography>
                    </Tooltip>
                    <Typography variant="body2" color="text.secondary">
                      Candidates Applied: {candidates.filter((candidate) => candidate.jobId === job.id).length}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between' }}>
                    <Tooltip title="View Candidates" arrow>
                      <IconButton color="primary" onClick={() => handleViewCandidates(job.id)}>
                        <Badge badgeContent={candidates.filter((candidate) => candidate.jobId === job.id).length} color="secondary">
                          <GroupIcon />
                        </Badge>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Job" arrow>
                      <IconButton color="info" onClick={() => handleEditJob(job)}>
                        <ModeEditOutlineIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Job" arrow>
                      <IconButton color="error" onClick={() => handleDeleteJob(job.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Manage Assessment" arrow>
                      <IconButton color="secondary" onClick={() => navigate(`/assessment/${job.id}`)}>
                        <AssignmentIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </StyledCard>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="h6" align="center" color="textSecondary">
                No jobs found.
              </Typography>
            </Grid>
          )}
        </Grid>

        <Box sx={{ marginTop: 6 }}>
          <Typography variant="h5" gutterBottom>
            Job Applications Overview
          </Typography>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <RechartsTooltip />
                <Bar dataKey="Candidates" fill={theme.palette.primary.main} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Typography color="textSecondary">No data available for charts.</Typography>
          )}
        </Box>

        {/* Add Job Dialog */}
        <Dialog open={openAddDialog} onClose={handleCloseAddJobDialog} fullWidth maxWidth="sm">
          <DialogTitle>Add New Job</DialogTitle>
          <DialogContent>
            <TextField
              label="Job Title"
              fullWidth
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
              margin="dense"
            />
            <TextField
              label="Job Description"
              fullWidth
              value={newJob.description}
              onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
              margin="dense"
              multiline
              rows={4}
            />
            



          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddJobDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddJob} color="primary">
              Add Job
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Job Dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog} fullWidth maxWidth="sm">
          <DialogTitle>Edit Job</DialogTitle>
          <DialogContent>
            <TextField
              label="Job Title"
              fullWidth
              value={jobToEdit.title}
              onChange={(e) => setJobToEdit({ ...jobToEdit, title: e.target.value })}
              margin="dense"
            />
            <TextField
              label="Job Description"
              fullWidth
              value={jobToEdit.description}
              onChange={(e) => setJobToEdit({ ...jobToEdit, description: e.target.value })}
              margin="dense"
              multiline
              rows={4}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSaveJobEdit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

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

export default Dashboard;
