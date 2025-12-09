import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Login from "../components/auth/Login";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { colors } = useTheme();
  const from = location.state?.from?.pathname || "/home";

  const handleLogin = async (credentials) => {
    // replace with real auth call
    const fakeUser = { id: 1, username: credentials.username || "user", role: "user" };
    login(fakeUser);
    navigate(from, { replace: true });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${colors.background.secondary}`}>
      <Login onSubmit={handleLogin} />
    </div>
  );
}