import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/Login";
import NotFound from "./components/NotFound";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Chat from "./components/Chat";
import SignUpPage from "./components/SignUp";
import Header from "./components/Header";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  // Функция для проверки наличия токена в localStorage
  const isUserAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

  const isUsernameAuthenticated = () => {
    const username = localStorage.getItem("username");
    return !!username;
  };

  const [isLoggedIn, setIsLoggedIn] = useState(isUsernameAuthenticated());
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/login";
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={isUserAuthenticated() ? <Chat /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
