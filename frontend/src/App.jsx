import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import StudentRoutes from './routes/StudentRoutes';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/student/*" element={<StudentRoutes />} />
        <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;


