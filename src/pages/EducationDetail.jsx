import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Container from "../components/Container";
import usePortfolioStore from "../store/store";
import DriveImage from "../components/DriveImage";

export default function EducationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [education, setEducation] = useState(null);

  const educations = usePortfolioStore((s) => s.educations || []);
  const fetchEducationsRemote = usePortfolioStore((s) => s.fetchEducationsRemote);

  useEffect(() => {
    const loadEducation = async () => {
      setLoading(true);
      if (educations.length === 0) {
        await fetchEducationsRemote();
      }
      const found = educations.find((e) => String(e.id) === String(id));
      setEducation(found || null);
      setLoading(false);
    };
    loadEducation();
  }, [id, educations, fetchEducationsRemote]);

  if (loading) {
    return (
      <Container>
        <div className={`${colors.background.secondary} rounded-lg p-12 text-center`}>
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mb-4"></div>
          <p className={colors.text.secondary}>Loading education...</p>
        </div>
      </Container>
    );
  }

  if (!education) {
    return (
      <Container>
        <div className={`${colors.background.secondary} rounded-lg p-8 text-center`}>
          <svg className={`mx-auto h-16 w-16 ${colors.text.muted} mb-4`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className={`text-xl font-semibold mb-2 ${colors.text.primary}`}>Education Not Found</h3>
          <p className={`mb-6 ${colors.text.secondary}`}>The education record you're looking for doesn't exist.</p>
          <Link to="/educations" className={`${colors.button.primary} px-6 py-3 rounded-lg transition inline-flex items-center gap-2`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Education
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
            <li><Link to="/educations" className={`${colors.text.secondary} hover:${colors.text.primary}`}>Education</Link></li>
            <li className={colors.text.muted}>/</li>
            <li className={colors.text.primary}>{education.school}</li>
          </ol>
        </nav>

        {/* Main Content */}
        <div className={`${colors.background.primary} rounded-lg shadow-lg border ${colors.border} overflow-hidden`}>
          {/* Header with Image */}
          <div className={`${colors.background.secondary} p-8 border-b ${colors.border}`}>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-400 to-indigo-600">
                <DriveImage
                  src={education.educationImageUrl}
                  alt={education.school}
                  className="w-full h-full object-cover"
                  fallback={
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                      </svg>
                    </div>
                  }
                />
              </div>
              <div className="flex-1">
                <h1 className={`text-3xl font-bold mb-2 ${colors.text.primary}`}>{education.school}</h1>
                {education.degree && (
                  <span className="inline-block bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 px-4 py-1 rounded-full text-sm font-medium mb-3">
                    {education.degree}
                  </span>
                )}
                {education.field && (
                  <p className={`text-lg ${colors.text.secondary} mb-2`}>{education.field}</p>
                )}
                {(education.startYear || education.endYear) && (
                  <div className="flex items-center gap-2">
                    <svg className={`w-5 h-5 ${colors.text.muted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className={`${colors.text.secondary}`}>
                      {education.startYear} - {education.endYear || 'Present'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-8">
            {/* Description */}
            {education.description && (
              <div className="mb-8">
                <h2 className={`text-xl font-semibold mb-3 ${colors.text.primary}`}>Description</h2>
                <p className={`${colors.text.secondary} leading-relaxed whitespace-pre-wrap`}>
                  {education.description}
                </p>
              </div>
            )}

            {/* Additional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(education).map(([key, value]) => {
                if (['id', 'school', 'degree', 'field', 'startYear', 'endYear', 'description', 'educationImageUrl', 'imageId'].includes(key)) return null;
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
                onClick={() => navigate('/educations')}
                className={`${colors.button.secondary} px-6 py-2 rounded-lg transition inline-flex items-center gap-2`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                View All Education
              </button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}