// src/App.js

import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import CandidateDetails from './pages/CandidateDetails';
import Assessment from './pages/Assessment';
import JobApplication from './pages/JobApplication';
import Profile from './pages/Profile'; // Import Profile page

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Dashboard />
    },
    {
      path: "/candidates/:jobId",
      element: <Candidates />
    },
    {
      path: "/candidates/details/:candidateId",
      element: <CandidateDetails />
    },
    {
      path: "/assessment/:jobId",
      element: <Assessment />
    },
    {
      path: "/jobapp",
      element: <JobApplication />
    },
    {
      path: "/profile", // New route for Profile page
      element: <Profile />
    },
    {
      path: "*",
      element: (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h2>404 - Page Not Found</h2>
          <p>The page you are looking for does not exist.</p>
        </div>
      )
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
