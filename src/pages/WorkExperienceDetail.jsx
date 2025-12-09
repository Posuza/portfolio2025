import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Container from "../components/Container";
import usePortfolioStore from "../store/store";
import DriveImage from "../components/DriveImage";

export default function WorkExperienceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [work, setWork] = useState(null);

  const workExperiences = usePortfolioStore((s) => s.workExperiences || []);
  const fetchWorkRemote = usePortfolioStore((s) => s.fetchWorkRemote);

  useEffect(() => {
    const loadWork = async () => {
      setLoading(true);
      if (workExperiences.length === 0) {
        await fetchWorkRemote();
      }
      const found = workExperiences.find((w) => String(w.id) === String(id));
      setWork(found || null);
      setLoading(false);
    };
    loadWork();
  }, [id, workExperiences, fetchWorkRemote]);

  if (loading) {
    return (
      <Container>
        <div className={`${colors.background.secondary} rounded-lg p-12 text-center`}>
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mb-4"></div>
          <p className={colors.text.secondary}>Loading work experience...</p>
        </div>
      </Container>
    );
  }

  if (!work) {
    return (
      <Container>
        <div className={`${colors.background.secondary} rounded-lg p-8 text-center`}>
          <svg className={`mx-auto h-16 w-16 ${colors.text.muted} mb-4`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className={`text-xl font-semibold mb-2 ${colors.text.primary}`}>Work Experience Not Found</h3>
          <p className={`mb-6 ${colors.text.secondary}`}>The work experience you're looking for doesn't exist.</p>
          <Link to="/work-experiences" className={`${colors.button.primary} px-6 py-3 rounded-lg transition inline-flex items-center gap-2`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Work Experience
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm">
            <li><Link to="/home" className={`${colors.text.secondary} hover:${colors.text.primary}`}>Home</Link></li>
            <li className={colors.text.muted}>/</li>
            <li><Link to="/work-experiences" className={`${colors.text.secondary} hover:${colors.text.primary}`}>Work Experience</Link></li>
            <li className={colors.text.muted}>/</li>
            <li className={colors.text.primary}>{work.company}</li>
          </ol>
        </nav>

        {/* Main Content */}
        <div className={`${colors.background.primary} rounded-lg shadow-lg border ${colors.border} overflow-hidden`}>
          {/* Header */}
          <div className={`${colors.background.secondary} p-8 border-b ${colors.border}`}>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-green-400 to-teal-600">
                <DriveImage
                  src={work.workImageUrl}
                  alt={work.company}
                  className="w-full h-full object-cover"
                  fallback={
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  }
                />
              </div>
              <div className="flex-1">
                <h1 className={`text-3xl font-bold mb-2 ${colors.text.primary}`}>{work.company}</h1>
                {work.position && (
                  <p className={`text-xl ${colors.text.secondary} mb-3`}>{work.position}</p>
                )}
                {(work.startDate || work.endDate) && (
                  <div className="flex items-center gap-2">
                    <svg className={`w-5 h-5 ${colors.text.muted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className={`${colors.text.secondary}`}>
                      {work.startDate ? new Date(work.startDate).toLocaleDateString() : 'Start'} - {work.endDate ? new Date(work.endDate).toLocaleDateString() : 'Present'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-8">
            {/* Description */}
            {work.description && (
              <div className="mb-8">
                <h2 className={`text-xl font-semibold mb-3 ${colors.text.primary} flex items-center gap-2`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Responsibilities & Achievements
                </h2>
                <p className={`${colors.text.secondary} leading-relaxed whitespace-pre-wrap ${colors.background.secondary} p-6 rounded-lg`}>
                  {work.description}
                </p>
              </div>
            )}

            {/* Additional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(work).map(([key, value]) => {
                if (['id', 'company', 'position', 'startDate', 'endDate', 'description', 'workImageUrl', 'imageId'].includes(key)) return null;
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

            {/* Navigation */}
            <div className={`mt-8 pt-6 border-t ${colors.border}`}>
              <button
                onClick={() => navigate('/work-experiences')}
                className={`${colors.button.secondary} px-6 py-2 rounded-lg transition inline-flex items-center gap-2`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                View All Experience
              </button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}