import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext"; // added
import ThemedToastContainer from "./components/ThemedToastContainer";
import 'react-toastify/dist/ReactToastify.css';
import "./i18n";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <ThemedToastContainer />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);


