import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Container from "../components/Container";
import usePortfolioStore from "../store/store";
import DriveImage from "../components/DriveImage";

export default function Projects() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);

  const projects = usePortfolioStore((s) => s.projects || []);
  const fetchProjectsRemote = usePortfolioStore((s) => s.fetchProjectsRemote);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchProjectsRemote();
      setLoading(false);
    };
    loadData();
  }, [fetchProjectsRemote]);

  if (loading) {
    return (
      <Container>
        <div
          className={`${colors.background.secondary} rounded-lg p-12 text-center`}
        >
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mb-4"></div>
          <p className={colors.text.secondary}>Loading projects...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${colors.text.primary}`}>
            Projects
          </h1>
          <p className={colors.text.secondary}>
            Explore my portfolio of production apps, demos, and utilities.
          </p>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div
            className={`${colors.background.secondary} rounded-lg p-12 text-center`}
          >
            <svg
              className={`mx-auto h-16 w-16 ${colors.text.muted} mb-4`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className={colors.text.secondary}>No projects found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className={`${colors.background.primary} rounded-lg border ${colors.border} overflow-hidden hover:shadow-lg transition-all hover:scale-105`}
              >
                {/* Image */}
                <div className="h-48 overflow-hidden bg-gradient-to-br from-sky-400 to-blue-600">
                  <DriveImage
                    src={project.projectsImageUrl}
                    alt={project.name}
                    className="w-full h-full object-cover"
                    fallback={
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-20 h-20 text-white opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                      </div>
                    }
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3
                    className={`text-xl font-semibold mb-2 ${colors.text.primary}`}
                  >
                    {project.name}
                  </h3>
                  <p
                    className={`${colors.text.secondary} text-sm line-clamp-3`}
                  >
                    {project.description || "No description available."}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
