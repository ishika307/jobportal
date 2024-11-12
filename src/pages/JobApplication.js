import React, { useEffect, useState } from 'react';
import { Card, CardActions, CardContent, CardMedia, Typography, Container, Grid, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WorkIcon from '@mui/icons-material/Work';

const LOCAL_STORAGE_KEY_JOBS = 'jobsData';
const LOCAL_STORAGE_KEY_CANDIDATES = 'candidatesData';

const JobApplication = () => {
  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [candidate, setCandidate] = useState({
    name: '',
    email: '',
    resume: null,
    applicationDate: new Date().toLocaleDateString(),
    status: 'Under Review'
  });

  useEffect(() => {
    const jobsFromStorage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_JOBS)) || [];
    setJobs(jobsFromStorage);
  }, []);

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCandidate({
      name: '',
      email: '',
      resume: null,
      applicationDate: new Date().toLocaleDateString(),
      status: 'Under Review'
    });
  };

  const handleResumeUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setCandidate({ ...candidate, resume: reader.result });
    };
    reader.readAsDataURL(file); // Convert file to base64
  };

  const handleApply = () => {
    const candidatesFromStorage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_CANDIDATES)) || [];
    const newCandidate = {
      ...candidate,
      jobId: selectedJob.id,
      applicationDate: new Date().toLocaleDateString(),
      status: 'Under Review'
    };

    const updatedCandidates = [...candidatesFromStorage, newCandidate];
    localStorage.setItem(LOCAL_STORAGE_KEY_CANDIDATES, JSON.stringify(updatedCandidates));
    toast.success("Application submitted successfully!");

    handleClose();
  };

  return (
    <Container style={{ padding: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Job Application Portal
      </Typography>
      <Grid container spacing={4}>
        {jobs.map((job) => (
          <Grid item key={job.id} xs={12} sm={6} md={4}>
            <Card style={{ minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
              <CardMedia>
                <WorkIcon style={{ fontSize: '100px', color: '#3f51b5', padding: '20px' }} />
              </CardMedia>
              <CardContent>
                <Typography variant="h6" component="div">
                  {job.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {job.description}
                </Typography>
              </CardContent>
              <CardActions style={{ marginTop: 'auto' }}>
                <Button size="small" color="primary" onClick={() => handleApplyClick(job)}>
                  Apply Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Apply for {selectedJob && selectedJob.title}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={candidate.name}
            onChange={(e) => setCandidate({ ...candidate, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={candidate.email}
            onChange={(e) => setCandidate({ ...candidate, email: e.target.value })}
          />
          <Button
            variant="outlined"
            component="label"
            style={{ marginTop: '20px', width: '100%' }}
          >
            Upload Resume
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              hidden
              onChange={handleResumeUpload}
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleApply} color="primary">
            Submit Application
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </Container>
  );
};

export default JobApplication;
