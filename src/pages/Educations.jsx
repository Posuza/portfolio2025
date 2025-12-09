import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Container from "../components/Container";
import usePortfolioStore from "../store/store";
import DriveImage from "../components/DriveImage";

export default function Educations() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  
  const educations = usePortfolioStore((s) => s.educations || []);
  const fetchEducationsRemote = usePortfolioStore((s) => s.fetchEducationsRemote);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchEducationsRemote();
      setLoading(false);
    };
    loadData();
  }, [fetchEducationsRemote]);

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

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${colors.text.primary}`}>Education</h1>
          <p className={colors.text.secondary}>Academic background, degrees, and certifications.</p>
        </div>

        {/* Education Timeline */}
        {educations.length === 0 ? (
          <div className={`${colors.background.secondary} rounded-lg p-12 text-center`}>
            <svg className={`mx-auto h-16 w-16 ${colors.text.muted} mb-4`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
            <p className={colors.text.secondary}>No education records found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {educations.map((edu) => (
              <Link
                key={edu.id}
                to={`/educations/${edu.id}`}
                className={`${colors.background.primary} rounded-lg border ${colors.border} p-6 hover:shadow-lg transition-all block`}
              >
                <div className="flex gap-6">
                  {/* Logo */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-400 to-indigo-600">
                    <DriveImage
                      src={edu.educationImageUrl}
                      alt={edu.school}
                      className="w-full h-full object-cover"
                      fallback={
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-10 h-10 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                          </svg>
                        </div>
                      }
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className={`text-2xl font-semibold mb-1 ${colors.text.primary}`}>
                      {edu.school}
                    </h3>
                    {edu.degree && (
                      <span className="inline-block bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 px-3 py-1 rounded-full text-sm font-medium mb-2">
                        {edu.degree}
                      </span>
                    )}
                    {edu.field && (
                      <p className={`text-lg ${colors.text.secondary} mb-2`}>{edu.field}</p>
                    )}
                    {(edu.startYear || edu.endYear) && (
                      <div className="flex items-center gap-2 mb-3">
                        <svg className={`w-4 h-4 ${colors.text.muted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className={`text-sm ${colors.text.secondary}`}>
                          {edu.startYear} - {edu.endYear || 'Present'}
                        </span>
                      </div>
                    )}
                    {edu.description && (
                      <p className={`${colors.text.secondary} line-clamp-2`}>
                        {edu.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}