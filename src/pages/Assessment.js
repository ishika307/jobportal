// src/pages/AssessmentPage.js

import React, { useState, useEffect, useMemo } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Grid,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  AppBar,
  Toolbar,
  CssBaseline,
  Tooltip,
} from '@mui/material';
import { Edit, Delete, ArrowBack, Brightness4, Brightness7 } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  transition: 'transform 0.3s, box-shadow 0.3s',
  borderRadius: theme.spacing(2),
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[6],
  },
}));

const AssessmentPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [jobQuestions, setJobQuestions] = useState([]);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState({ optionA: '', optionB: '', optionC: '', optionD: '' });
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [themeMode, setThemeMode] = useState('light'); // Theme state: 'light' or 'dark'

  // Load theme mode from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('themeMode') || 'light';
    setThemeMode(savedTheme);
  }, []);

  // Create MUI theme based on themeMode
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
          primary: {
            main: '#1976D2',
          },
          secondary: {
            main: '#DC004E',
          },
          background: {
            default: themeMode === 'light' ? '#f5f5f5' : '#121212',
            paper: themeMode === 'light' ? '#ffffff' : '#1e1e1e',
          },
          text: {
            primary: themeMode === 'light' ? '#000000' : '#ffffff',
            secondary: themeMode === 'light' ? '#555555' : '#cccccc',
          },
        },
        typography: {
          fontFamily: '"Roboto Slab", serif',
          h4: {
            fontWeight: 700,
          },
          h5: {
            fontWeight: 600,
          },
          h6: {
            fontWeight: 500,
          },
          body1: {
            fontWeight: 400,
          },
          button: {
            fontWeight: 600,
            textTransform: 'none',
          },
        },
      }),
    [themeMode]
  );

  // Toggle theme mode and save preference to localStorage
  const toggleTheme = () => {
    const newTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
    localStorage.setItem('themeMode', newTheme);
  };

  const LOCAL_STORAGE_KEY_JOBS = 'jobsData';
  const LOCAL_STORAGE_KEY_JOB_QUESTIONS = `job_${jobId}_questions`;

  // Fetch Jobs and Questions from Local Storage
  useEffect(() => {
    const jobsFromStorage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_JOBS)) || [];
    setJobs(jobsFromStorage);
    const selectedJobQuestions = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_JOB_QUESTIONS)) || [];
    setJobQuestions(selectedJobQuestions);
  }, [jobId]);

  // Handler Functions

  const handleAddOrUpdateQuestion = () => {
    if (!question.trim()) {
      setSnackbar({ open: true, message: 'Question cannot be empty.', severity: 'error' });
      return;
    }

    const duplicateQuestion = jobQuestions.some(
      (q, index) => q.question === question.trim() && index !== editIndex
    );

    if (duplicateQuestion) {
      setSnackbar({ open: true, message: 'This question already exists for this job.', severity: 'warning' });
      return;
    }

    const newQuestion = {
      question: question.trim(),
      options: {
        optionA: options.optionA.trim(),
        optionB: options.optionB.trim(),
        optionC: options.optionC.trim(),
        optionD: options.optionD.trim(),
      },
      correctAnswer: correctAnswer.trim(),
    };

    let updatedQuestions;

    if (editIndex !== null) {
      updatedQuestions = [...jobQuestions];
      updatedQuestions[editIndex] = newQuestion;
      setEditIndex(null);
      setSnackbar({ open: true, message: 'Question updated successfully.', severity: 'success' });
    } else {
      updatedQuestions = [...jobQuestions, newQuestion];
      setSnackbar({ open: true, message: 'Question added successfully.', severity: 'success' });
    }

    localStorage.setItem(LOCAL_STORAGE_KEY_JOB_QUESTIONS, JSON.stringify(updatedQuestions));
    setJobQuestions(updatedQuestions);
    resetForm();
  };

  const handleEditQuestion = (index) => {
    const questionToEdit = jobQuestions[index];
    setQuestion(questionToEdit.question);
    setOptions(questionToEdit.options);
    setCorrectAnswer(questionToEdit.correctAnswer);
    setEditIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteQuestion = () => {
    const updatedQuestions = jobQuestions.filter((_, i) => i !== deleteIndex);
    localStorage.setItem(LOCAL_STORAGE_KEY_JOB_QUESTIONS, JSON.stringify(updatedQuestions));
    setJobQuestions(updatedQuestions);
    setDeleteIndex(null);
    setSnackbar({ open: true, message: 'Question deleted successfully.', severity: 'info' });
  };

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  const resetForm = () => {
    setQuestion('');
    setOptions({ optionA: '', optionB: '', optionC: '', optionD: '' });
    setCorrectAnswer('');
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* AppBar with Theme Toggle */}
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back to dashboard"
            onClick={handleBackToDashboard}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Assessment Page
          </Typography>
          {/* Theme Toggle Button */}
          <Tooltip title="Toggle light/dark theme">
            <IconButton color="inherit" onClick={toggleTheme}>
              {themeMode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Grid container spacing={3} sx={{ padding: 3, maxWidth: '1200px', margin: 'auto' }}>
        {/* Page Title */}
        <Grid item xs={12}>
          <Typography variant="h4" align="center" gutterBottom>
            Assessment for Job ID: {jobId}
          </Typography>
        </Grid>

        {/* Job Selection */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Select Job</InputLabel>
            <Select
              value={jobId}
              label="Select Job"
              onChange={(e) => navigate(`/assessment/${e.target.value}`)}
            >
              {jobs.map((job) => (
                <MenuItem key={job.id} value={job.id}>
                  {job.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Question Form */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {editIndex !== null ? 'Edit Question' : 'Create Question'}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Question"
                    fullWidth
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                {['A', 'B', 'C', 'D'].map((option) => (
                  <Grid item xs={6} md={3} key={option}>
                    <TextField
                      label={`Option ${option}`}
                      name={`option${option}`}
                      value={options[`option${option}`]}
                      onChange={handleOptionChange}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="correct-answer-label">Correct Answer</InputLabel>
                    <Select
                      labelId="correct-answer-label"
                      id="correct-answer-select"
                      value={correctAnswer}
                      label="Correct Answer"
                      onChange={(e) => setCorrectAnswer(e.target.value)}
                    >
                      {['A', 'B', 'C', 'D'].map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    onClick={handleAddOrUpdateQuestion}
                    variant="contained"
                    color="secondary"
                    fullWidth
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: 'secondary.main',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.05)' },
                    }}
                  >
                    {editIndex !== null ? 'Update Question' : 'Add Question'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Divider */}
        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* Existing Questions */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Existing Questions
          </Typography>
          <Grid container spacing={2}>
            {jobQuestions.length > 0 ? (
              jobQuestions.map((q, index) => (
                <Grid item xs={12} key={index}>
                  <StyledCard>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {q.question}
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        A: {q.options.optionA}
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        B: {q.options.optionB}
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        C: {q.options.optionC}
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        D: {q.options.optionD}
                      </Typography>
                      <Typography variant="body2" color="primary" sx={{ marginTop: 1 }}>
                        Correct Answer: {q.correctAnswer}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Tooltip title="Edit Question">
                        <IconButton
                          onClick={() => handleEditQuestion(index)}
                          color="primary"
                          aria-label="edit question"
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Question">
                        <IconButton
                          onClick={() => setDeleteIndex(index)}
                          color="error"
                          aria-label="delete question"
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </CardActions>
                  </StyledCard>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography color="textSecondary">No questions for this job yet.</Typography>
              </Grid>
            )}
          </Grid>
        </Grid>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteIndex !== null}
          onClose={() => setDeleteIndex(null)}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">Delete Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Are you sure you want to delete this question? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteIndex(null)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteQuestion} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for Feedback Messages */}
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
      </Grid>
    </ThemeProvider>
  );
};

export default AssessmentPage;
