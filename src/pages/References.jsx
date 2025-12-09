import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Container from "../components/Container";
import usePortfolioStore from "../store/store";
import DriveImage from "../components/DriveImage";

export default function References() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  
  const references = usePortfolioStore((s) => s.references || []);
  const fetchReferencesRemote = usePortfolioStore((s) => s.fetchReferencesRemote);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchReferencesRemote();
      setLoading(false);
    };
    loadData();
  }, [fetchReferencesRemote]);

  if (loading) {
    return (
      <Container>
        <div className={`${colors.background.secondary} rounded-lg p-12 text-center`}>
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mb-4"></div>
          <p className={colors.text.secondary}>Loading references...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${colors.text.primary}`}>References</h1>
          <p className={colors.text.secondary}>Professional recommendations and contacts.</p>
        </div>

        {/* References Grid */}
        {references.length === 0 ? (
          <div className={`${colors.background.secondary} rounded-lg p-12 text-center`}>
            <svg className={`mx-auto h-16 w-16 ${colors.text.muted} mb-4`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className={colors.text.secondary}>No references found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {references.map((ref) => (
              <Link
                key={ref.id}
                to={`/references/${ref.id}`}
                className={`${colors.background.primary} rounded-lg border ${colors.border} p-6 hover:shadow-lg transition-all`}
              >
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
                    <DriveImage
                      src={ref.referenceImageUrl}
                      alt={ref.name}
                      className="w-full h-full object-cover"
                      fallback={
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      }
                    />
                  </div>

                  {/* Name & Relationship */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-xl font-semibold ${colors.text.primary} truncate`}>
                      {ref.name}
                    </h3>
                    {ref.relationship && (
                      <p className={`text-sm ${colors.text.secondary} truncate`}>
                        {ref.relationship}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact Info */}
                {ref.company && (
                  <div className="flex items-center gap-2 mb-2">
                    <svg className={`w-4 h-4 ${colors.text.muted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className={`text-sm ${colors.text.secondary}`}>{ref.company}</span>
                  </div>
                )}

                {ref.contact && (
                  <p className={`text-sm ${colors.text.secondary} line-clamp-2`}>
                    {ref.contact}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}