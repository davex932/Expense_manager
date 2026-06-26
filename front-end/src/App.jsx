import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Profile from './pages/Profile';
import Categories from './pages/Categories';
import Budget from './pages/Budget';
import Statistiques from './pages/statistiques';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/expenses" element={<ProtectedRoute><Layout><Expenses /></Layout></ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute><Layout><Categories /></Layout></ProtectedRoute>} />
        <Route path="/budget" element={<ProtectedRoute><Layout><Budget /></Layout></ProtectedRoute>} />
        <Route path="/statistiques" element={<ProtectedRoute><Layout><Statistiques /></Layout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
        
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
