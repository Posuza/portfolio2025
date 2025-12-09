import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Container from "../components/Container";
import usePortfolioStore from "../store/store";
import DriveImage from "../components/DriveImage";

export default function ReferenceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [reference, setReference] = useState(null);

  const references = usePortfolioStore((s) => s.references || []);
  const fetchReferencesRemote = usePortfolioStore((s) => s.fetchReferencesRemote);

  useEffect(() => {
    const loadReference = async () => {
      setLoading(true);
      if (references.length === 0) {
        await fetchReferencesRemote();
      }
      const found = references.find((r) => String(r.id) === String(id));
      setReference(found || null);
      setLoading(false);
    };
    loadReference();
  }, [id, references, fetchReferencesRemote]);

  if (loading) {
    return (
      <Container>
        <div className={`${colors.background.secondary} rounded-lg p-12 text-center`}>
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mb-4"></div>
          <p className={colors.text.secondary}>Loading reference...</p>
        </div>
      </Container>
    );
  }

  if (!reference) {
    return (
      <Container>
        <div className={`${colors.background.secondary} rounded-lg p-8 text-center`}>
          <svg className={`mx-auto h-16 w-16 ${colors.text.muted} mb-4`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className={`text-xl font-semibold mb-2 ${colors.text.primary}`}>Reference Not Found</h3>
          <p className={`mb-6 ${colors.text.secondary}`}>The reference you're looking for doesn't exist.</p>
          <Link to="/references" className={`${colors.button.primary} px-6 py-3 rounded-lg transition inline-flex items-center gap-2`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to References
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
            <li><Link to="/references" className={`${colors.text.secondary} hover:${colors.text.primary}`}>References</Link></li>
            <li className={colors.text.muted}>/</li>
            <li className={colors.text.primary}>{reference.name}</li>
          </ol>
        </nav>

        {/* Main Content */}
        <div className={`${colors.background.primary} rounded-lg shadow-lg border ${colors.border} overflow-hidden`}>
          {/* Header Card */}
          <div className={`${colors.background.secondary} p-8 border-b ${colors.border}`}>
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
                <DriveImage
                  src={reference.referenceImageUrl}
                  alt={reference.name}
                  className="w-full h-full object-cover"
                  fallback={
                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  }
                />
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className={`text-3xl font-bold mb-2 ${colors.text.primary}`}>{reference.name}</h1>
                {reference.relationship && (
                  <p className={`text-lg ${colors.text.secondary} mb-3`}>{reference.relationship}</p>
                )}
                {reference.company && (
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <svg className={`w-5 h-5 ${colors.text.muted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p className={colors.text.secondary}>{reference.company}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-8">
            <h2 className={`text-xl font-semibold mb-4 ${colors.text.primary} flex items-center gap-2`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Information
            </h2>

            <div className={`${colors.background.secondary} rounded-lg p-6 space-y-4`}>
              {reference.email && (
                <div className="flex items-start gap-3">
                  <svg className={`w-5 h-5 ${colors.text.muted} mt-0.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <div>
                    <p className={`text-sm ${colors.text.muted} mb-1`}>Email</p>
                    <a href={`mailto:${reference.email}`} className={`${colors.text.primary} hover:text-sky-600`}>
                      {reference.email}
                    </a>
                  </div>
                </div>
              )}

              {reference.phone && (
                <div className="flex items-start gap-3">
                  <svg className={`w-5 h-5 ${colors.text.muted} mt-0.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className={`text-sm ${colors.text.muted} mb-1`}>Phone</p>
                    <a href={`tel:${reference.phone}`} className={`${colors.text.primary} hover:text-sky-600`}>
                      {reference.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* Additional Fields */}
              {Object.entries(reference).map(([key, value]) => {
                if (['id', 'name', 'relationship', 'company', 'email', 'phone', 'referenceImageUrl', 'imageId'].includes(key)) return null;
                return (
                  <div key={key} className="flex items-start gap-3">
                    <svg className={`w-5 h-5 ${colors.text.muted} mt-0.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className={`text-sm ${colors.text.muted} mb-1 capitalize`}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className={colors.text.primary}>{String(value || '—')}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation */}
            <div className={`mt-8 pt-6 border-t ${colors.border}`}>
              <button
                onClick={() => navigate('/references')}
                className={`${colors.button.secondary} px-6 py-2 rounded-lg transition inline-flex items-center gap-2`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                View All References
              </button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}