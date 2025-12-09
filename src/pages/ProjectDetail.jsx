import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Container from "../components/Container";
import usePortfolioStore from "../store/store";
import DriveImage from "../components/DriveImage";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);

  const projects = usePortfolioStore((s) => s.projects || []);
  const fetchProjectsRemote = usePortfolioStore((s) => s.fetchProjectsRemote);

  useEffect(() => {
    const loadProject = async () => {
      setLoading(true);
      if (projects.length === 0) {
        await fetchProjectsRemote();
      }
      const found = projects.find((p) => String(p.id) === String(id));
      setProject(found || null);
      setLoading(false);
    };
    loadProject();
  }, [id, projects, fetchProjectsRemote]);

  if (loading) {
    return (
      <Container>
        <div className={`${colors.background.secondary} rounded-lg p-12 text-center`}>
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mb-4"></div>
          <p className={colors.text.secondary}>Loading project...</p>
        </div>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container>
        <div className={`${colors.background.secondary} rounded-lg p-8 text-center`}>
          <svg className={`mx-auto h-16 w-16 ${colors.text.muted} mb-4`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className={`text-xl font-semibold mb-2 ${colors.text.primary}`}>Project Not Found</h3>
          <p className={`mb-6 ${colors.text.secondary}`}>The project you're looking for doesn't exist.</p>
          <Link to="/projects" className={`${colors.button.primary} px-6 py-3 rounded-lg transition inline-flex items-center gap-2`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm">
            <li><Link to="/home" className={`${colors.text.secondary} hover:${colors.text.primary}`}>Home</Link></li>
            <li className={colors.text.muted}>/</li>
            <li><Link to="/projects" className={`${colors.text.secondary} hover:${colors.text.primary}`}>Projects</Link></li>
            <li className={colors.text.muted}>/</li>
            <li className={colors.text.primary}>{project.name}</li>
          </ol>
        </nav>

        {/* Main Content */}
        <div className={`${colors.background.primary} rounded-lg shadow-lg border ${colors.border} overflow-hidden`}>
          {/* Header */}
          <div className={`${colors.background.secondary} px-6 py-4 border-b ${colors.border} flex items-center justify-between`}>
            <div>
              <h1 className={`text-3xl font-bold ${colors.text.primary}`}>{project.name}</h1>
              {project.id && <p className={`text-sm ${colors.text.muted} mt-1`}>ID: {project.id}</p>}
            </div>
            <Link to="/projects" className={`${colors.button.secondary} px-4 py-2 rounded-lg transition`}>
              ← Back
            </Link>
          </div>

          {/* Image */}
          {project.projectsImageUrl && (
            <div className="w-full h-96 overflow-hidden bg-gradient-to-br from-sky-400 to-blue-600">
              <DriveImage
                src={project.projectsImageUrl}
                alt={project.name}
                className="w-full h-full object-cover"
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-20 h-20 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                }
              />
            </div>
          )}

          {/* Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Description */}
              <div className="md:col-span-2">
                <h2 className={`text-xl font-semibold mb-3 ${colors.text.primary}`}>Description</h2>
                <p className={`${colors.text.secondary} leading-relaxed whitespace-pre-wrap`}>
                  {project.description || 'No description provided.'}
                </p>
              </div>

              {/* Additional Fields */}
              {Object.entries(project).map(([key, value]) => {
                if (['id', 'name', 'description', 'projectsImageUrl', 'imageId'].includes(key)) return null;
                return (
                  <div key={key}>
                    <label className={`block text-sm font-medium ${colors.text.muted} mb-2 capitalize`}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <p className={`${colors.text.primary} ${colors.background.secondary} px-4 py-3 rounded-lg`}>
                      {String(value || '—')}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className={`mt-8 pt-6 border-t ${colors.border} flex gap-3`}>
              <button
                onClick={() => navigate('/projects')}
                className={`${colors.button.secondary} px-6 py-2 rounded-lg transition`}
              >
                View All Projects
              </button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}