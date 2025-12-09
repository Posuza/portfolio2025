import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Container from "../components/Container";
import usePortfolioStore from "../store/store";

export default function Portfolio(props) {
  const params = useParams();
  const section = props.section || params.section;
  const id = props.id || params.id;
  const showDetail = props.showDetail ?? !!id;
  const { colors } = useTheme();

  // dynamic selectors: get items and appropriate fetcher from store
  const items = usePortfolioStore((s) => {
    switch (String(section)) {
      case "projects":
        return s.projects || [];
      case "educations":
        return s.educations || [];
      case "workExperiences":
        return s.workExperiences || [];
      case "references":
        return s.references || [];
      case "blogs":
        return s.blogs || [];
      case "Users":
        return s.users || [];
      default:
        return [];
    }
  });

  const fetcher = usePortfolioStore((s) => {
    switch (String(section)) {
      case "projects":
        return s.fetchProjectsRemote;
      case "educations":
        return s.fetchEducationsRemote;
      case "workExperiences":
        return s.fetchWorkRemote;
      case "references":
        return s.fetchReferencesRemote;
      case "blogs":
        return s.fetchBlogsRemote;
      case "Users":
        return s.fetchRemote;
      default:
        return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!section || typeof fetcher !== "function") return;
    let mounted = true;
    setLoading(true);
    setError(null);
    fetcher()
      .then((res) => {
        if (!mounted) return;
        if (res && res.success === false) {
          setError(res.error ? String(res.error) : "Failed to load data");
        }
      })
      .catch((err) => mounted && setError(err?.message || String(err)))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, [section, fetcher]);

  if (!section) {
    return (
      <Container>
        <div className={`${colors.background.secondary} rounded-lg p-6 ${colors.text.secondary}`}>
          Missing section parameter
        </div>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <div className={`${colors.background.secondary} rounded-lg p-8 text-center`}>
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-current mb-4"></div>
          <p className={colors.text.secondary}>Loading {section}…</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">Error loading data</h3>
          <p className="text-red-600 dark:text-red-300">{error}</p>
        </div>
      </Container>
    );
  }

  if (showDetail) {
    const item = (items || []).find((it) => String(it.id) === String(id));
    if (!item) {
      return (
        <Container>
          <div className={`${colors.background.secondary} rounded-lg p-6`}>
            <p className={colors.text.secondary}>Item not found</p>
            <Link to={`/${section}`} className={`inline-block mt-4 ${colors.button.secondary} px-4 py-2 rounded-lg transition`}>
              ← Back to {section}
            </Link>
          </div>
        </Container>
      );
    }

    return (
      <Container>
        <div className={`${colors.background.primary} rounded-lg shadow-sm border ${colors.border} overflow-hidden`}>
          <div className={`${colors.background.secondary} px-6 py-4 border-b ${colors.border}`}>
            <h2 className={`text-2xl font-semibold ${colors.text.primary} capitalize`}>{section} Detail</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(item).map(([key, value]) => {
                if (key.toLowerCase().includes('imageurl') && value) {
                  return (
                    <div key={key} className="md:col-span-2">
                      <label className={`block text-sm font-medium ${colors.text.secondary} mb-2 capitalize`}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <img src={value} alt={key} className="max-w-md rounded-lg border ${colors.border}" />
                    </div>
                  );
                }
                return (
                  <div key={key}>
                    <label className={`block text-sm font-medium ${colors.text.secondary} mb-1 capitalize`}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <p className={`${colors.text.primary} ${colors.background.secondary} px-3 py-2 rounded`}>
                      {String(value ?? '—')}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t ${colors.border}">
              <Link to={`/${section}`} className={`inline-flex items-center ${colors.button.secondary} px-4 py-2 rounded-lg transition`}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to {section}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className={`${colors.background.primary} rounded-lg shadow-sm border ${colors.border} overflow-hidden`}>
        <div className={`${colors.background.secondary} px-6 py-4 border-b ${colors.border} flex items-center justify-between`}>
          <h2 className={`text-2xl font-semibold ${colors.text.primary} capitalize`}>{section}</h2>
          <span className={`text-sm ${colors.text.muted}`}>{items.length} items</span>
        </div>

        {(items || []).length === 0 ? (
          <div className="p-12 text-center">
            <svg className={`mx-auto h-12 w-12 ${colors.text.muted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className={`mt-4 ${colors.text.secondary}`}>No items found</p>
            <p className={`mt-1 text-sm ${colors.text.muted}`}>Items will appear here once they are added</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y ${colors.border}">
              <thead className={colors.background.secondary}>
                <tr>
                  {Object.keys(items[0]).map((k) => (
                    <th key={k} className={`px-4 py-3 text-left text-xs font-medium ${colors.text.secondary} uppercase tracking-wider`}>
                      {k.replace(/([A-Z])/g, ' $1').trim()}
                    </th>
                  ))}
                  <th className={`px-4 py-3 text-right text-xs font-medium ${colors.text.secondary} uppercase tracking-wider`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`${colors.background.primary} divide-y ${colors.border}`}>
                {items.map((row, idx) => (
                  <tr key={row.id || idx} className={`hover:${colors.background.secondary} transition`}>
                    {Object.keys(row).map((k) => {
                      const val = row[k];
                      if (k.toLowerCase().includes('imageurl') && val) {
                        return (
                          <td key={k} className={`px-4 py-3 whitespace-nowrap ${colors.text.primary}`}>
                            <img src={val} alt="thumbnail" className="h-10 w-10 rounded object-cover" />
                          </td>
                        );
                      }
                      return (
                        <td key={k} className={`px-4 py-3 ${colors.text.primary}`}>
                          <div className="max-w-xs truncate">{String(val ?? '—')}</div>
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                      <Link 
                        to={`/${section}/${row.id}`} 
                        className={`inline-flex items-center px-3 py-1 ${colors.button.secondary} rounded transition text-xs font-medium`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Container>
  );
}