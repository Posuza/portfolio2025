import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Container from "../components/Container";
import usePortfolioStore from "../store/store";
import DriveImage from "../components/DriveImage";

export default function WorkExperiences() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  
  const workExperiences = usePortfolioStore((s) => s.workExperiences || []);
  const fetchWorkRemote = usePortfolioStore((s) => s.fetchWorkRemote);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchWorkRemote();
      setLoading(false);
    };
    loadData();
  }, [fetchWorkRemote]);

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

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${colors.text.primary}`}>Work Experience</h1>
          <p className={colors.text.secondary}>Professional roles, responsibilities, and achievements.</p>
        </div>

        {/* Work Timeline */}
        {workExperiences.length === 0 ? (
          <div className={`${colors.background.secondary} rounded-lg p-12 text-center`}>
            <svg className={`mx-auto h-16 w-16 ${colors.text.muted} mb-4`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className={colors.text.secondary}>No work experience found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {workExperiences.map((work) => (
              <Link
                key={work.id}
                to={`/work-experiences/${work.id}`}
                className={`${colors.background.primary} rounded-lg border ${colors.border} p-6 hover:shadow-lg transition-all block`}
              >
                <div className="flex gap-6">
                  {/* Company Logo */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-green-400 to-teal-600">
                    <DriveImage
                      src={work.workImageUrl}
                      alt={work.company}
                      className="w-full h-full object-cover"
                      fallback={
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      }
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className={`text-2xl font-semibold mb-1 ${colors.text.primary}`}>
                      {work.company}
                    </h3>
                    {work.position && (
                      <p className={`text-lg ${colors.text.secondary} mb-2`}>{work.position}</p>
                    )}
                    {(work.startDate || work.endDate) && (
                      <div className="flex items-center gap-2 mb-3">
                        <svg className={`w-4 h-4 ${colors.text.muted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className={`text-sm ${colors.text.secondary}`}>
                          {work.startDate ? new Date(work.startDate).toLocaleDateString() : 'Start'} - {work.endDate ? new Date(work.endDate).toLocaleDateString() : 'Present'}
                        </span>
                      </div>
                    )}
                    {work.description && (
                      <p className={`${colors.text.secondary} line-clamp-3`}>
                        {work.description}
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