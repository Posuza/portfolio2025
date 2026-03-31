import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Login from "../components/auth/Login";
import { useAuth } from "../context/AuthContext";
import userService from "../services/userService";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { colors } = useTheme();
  const from = location.state?.from?.pathname || "/home";
  const [error, setError] = useState(null);

  const handleLogin = async (credentials) => {
    try {
      setError(null);
      const response = await userService.login(credentials);

      const userData = response?.data?.user || response?.user || null;
      if (response?.success && userData) {
        login(userData);
        navigate(from, { replace: true });
      } else {
        setError(response?.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${colors.background.secondary}`}>
      <Login onSubmit={handleLogin} error={error} />
    </div>
  );
}
