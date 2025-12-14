import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useTheme } from "../../context/ThemeContext";

const Layout = () => {
  const { colors } = useTheme();

  return (
    <div className={`min-h-screen ${colors.background.secondary}`}>
      <div
        className={`sticky top-0 z-50 ${colors.background.primary} shadow-sm`}
      >
        <Header />
      </div>

      <main className="max-w-7xl mx-auto px-2 md:px-6 lg:px-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
