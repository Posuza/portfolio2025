import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Container from "../components/Container";

export default function ErrorNotFound() {
  const { colors } = useTheme();
  
  return (
    <Container>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center py-12 px-6">
          <div className="mb-8">
            <svg
              className={`mx-auto h-32 w-32 ${colors.text.muted}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          
          <h1 className={`text-6xl font-bold mb-4 ${colors.text.primary}`}>404</h1>
          <h2 className={`text-2xl font-semibold mb-4 ${colors.text.primary}`}>
            Page Not Found
          </h2>
          <p className={`mb-8 ${colors.text.secondary} max-w-md mx-auto`}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <Link
            to="/home"
            className={`inline-flex items-center gap-2 ${colors.button.primary} px-6 py-3 rounded-lg transition-all hover:scale-105`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Home
          </Link>
        </div>
      </div>
    </Container>
  );
}