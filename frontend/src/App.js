import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/Login';
import NotFound from './components/NotFound';
import 'bootstrap/dist/css/bootstrap.min.css';
import Chat from './components/Chat';

const App = () => {
  // Функция для проверки наличия токена в localStorage
  const isUserAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={isUserAuthenticated() ? <Chat /> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
