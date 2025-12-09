import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import Container from "../Container";
import Logo from "../Logo";
import ThemeToggle from "../ThemeToggle";
import LanguageSwitcher from "../LanguageSwitcher";

const Header = () => {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/projects", label: "Projects" },
    { path: "/educations", label: "Education" },
    { path: "/work-experiences", label: "Work" },
    { path: "/references", label: "References" },
    { path: "/blogs", label: "Blog" },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className={`${colors.background.primary} shadow-sm border-b ${colors.border}`}>
      <Container>
        <div className="flex items-center justify-between py-3">
          <Link to="/" className="flex items-center" aria-label="Home">
            <Logo size="md" showText />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm transition-colors ${
                  isActive(link.path)
                    ? `${colors.text.primary} font-semibold border-b-2 border-sky-600`
                    : `${colors.text.secondary} hover:text-sky-600`
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageSwitcher />
            
            {/* User Dropdown */}
            {user && (
              <div className="hidden md:block relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${colors.background.secondary} hover:${colors.background.tertiary}`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  <span className={`text-sm font-medium ${colors.text.primary}`}>{user.username}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {userMenuOpen && (
                  <div className={`absolute right-0 mt-2 w-48 ${colors.background.primary} rounded-lg shadow-lg border ${colors.border} py-2 z-50`}>
                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className={`block px-4 py-2 text-sm ${colors.text.secondary} hover:${colors.background.secondary}`}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                        window.location.href = '/';
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${colors.text.secondary} hover:${colors.background.secondary}`}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg ${colors.text.primary} hover:bg-gray-100 dark:hover:bg-gray-800`}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className={`md:hidden py-4 border-t ${colors.border}`}>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isActive(link.path)
                      ? `${colors.background.secondary} ${colors.text.primary} font-semibold`
                      : `${colors.text.secondary} hover:bg-gray-100 dark:hover:bg-gray-800`
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <>
                  <div className={`px-4 py-2 ${colors.background.secondary} rounded-lg flex items-center gap-2`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    <span className={`text-sm font-medium ${colors.text.primary}`}>{user.username}</span>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2 rounded-lg ${colors.text.secondary} hover:bg-gray-100 dark:hover:bg-gray-800`}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      window.location.href = '/';
                      setMobileMenuOpen(false);
                    }}
                    className={`px-4 py-2 rounded-lg ${colors.button.secondary} text-sm font-medium`}
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </nav>
        )}
      </Container>
    </header>
  );
};

export default Header;