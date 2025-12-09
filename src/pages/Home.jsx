import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Container from "../components/Container";
import usePortfolioStore from "../store/store";
import DriveImage from "../components/DriveImage";

const SECTIONS = [
  { key: "projects", title: "Projects", path: "/projects", desc: "Production apps, demos and utilities." },
  { key: "educations", title: "Education", path: "/educations", desc: "Academic background & courses." },
  { key: "workExperiences", title: "Work", path: "/work-experiences", desc: "Professional experience & roles." },
  { key: "references", title: "References", path: "/references", desc: "Recommendations & contacts." },
  { key: "blogs", title: "Blog", path: "/blogs", desc: "Technical writing & notes." },
];

const Home = () => {
  const { colors } = useTheme();
  const projects = usePortfolioStore((s) => s.projects || []);
  const fetchProjectsRemote = usePortfolioStore((s) => s.fetchProjectsRemote);

  useEffect(() => {
    if (typeof fetchProjectsRemote === "function") {
      fetchProjectsRemote().catch(() => {});
    }
  }, [fetchProjectsRemote]);

  const preview = (projects || []).slice(0, 6);

  return (
    <Container>
      <div className="py-12">
        {/* HERO */}
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2">
            <h2 className={`text-4xl md:text-5xl font-extrabold leading-tight ${colors.text.primary}`}>
              Paing Hein Thet Mon(Software and IOT Engineer)
            </h2>
            <p className={`mt-4 ${colors.text.secondary}`}>
              I build reliable, maintainable web applications and APIs. Specialties: React, Node.js, Google Apps Script,
              cloud integrations, and full-stack product delivery.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noreferrer"
                className={`inline-block ${colors.button.primary} px-4 py-2 rounded-lg transition`}
              >
                Download Resume
              </a>
              <Link
                to="/projects"
                className={`inline-block ${colors.button.secondary} px-4 py-2 rounded-lg transition`}
              >
                View Projects
              </Link>
              <a
                href="mailto:you@example.com"
                className={`inline-block ${colors.text.muted} hover:${colors.text.secondary} px-4 py-2 rounded transition`}
              >
                Contact
              </a>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex justify-center">
            <div className={`w-48 h-48 md:w-56 md:h-56 rounded-xl overflow-hidden ${colors.background.tertiary} flex items-center justify-center shadow-lg`}>
              <img src="/profile.jpg" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* SECTIONS */}
        <section className="max-w-7xl mx-auto px-4 mt-16">
          <h2 className={`text-2xl font-semibold mb-6 ${colors.text.primary}`}>Explore</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {SECTIONS.map((s) => (
              <Link
                key={s.key}
                to={s.path}
                className={`block p-6 ${colors.background.primary} border ${colors.border} rounded-lg hover:shadow-md transition-all hover:scale-105`}
              >
                <div className={`text-lg font-medium ${colors.text.primary}`}>{s.title}</div>
                <div className={`text-sm ${colors.text.muted} mt-2`}>{s.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* PROJECTS PREVIEW */}
        <section className="max-w-7xl mx-auto px-4 mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-semibold ${colors.text.primary}`}>Selected Projects</h2>
            <Link to="/projects" className={`${colors.button.secondary} px-4 py-2 rounded-lg text-sm transition`}>
              See all →
            </Link>
          </div>

          {preview.length === 0 ? (
            <div className={`${colors.background.secondary} rounded-lg p-12 text-center`}>
              <svg className={`mx-auto h-12 w-12 ${colors.text.muted} mb-4`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className={colors.text.secondary}>No projects available yet</p>
              <p className={`text-sm ${colors.text.muted} mt-2`}>Add projects in the admin panel or sync your data.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {preview.map((p) => (
                <article key={p.id || p.name} className={`${colors.background.primary} border ${colors.border} rounded-lg overflow-hidden hover:shadow-lg transition-shadow`}>
                  <div className="w-full h-40 bg-gradient-to-br from-sky-400 to-blue-600">
                    <DriveImage
                      src={p.projectsImageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      fallback={
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-12 h-12 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      }
                    />
                  </div>
                  <div className="p-4">
                    <h3 className={`font-semibold ${colors.text.primary}`}>{p.name}</h3>
                    <p className={`text-sm ${colors.text.secondary} mt-2 line-clamp-3`}>{p.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <Link to={`/projects/${p.id || ""}`} className={`text-sm ${colors.button.secondary} px-3 py-1 rounded transition`}>
                        View Details
                      </Link>
                      {p.tags && <span className={`text-xs ${colors.text.muted}`}>{p.tags}</span>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className={`mt-16 py-8 text-center text-sm ${colors.text.muted} border-t ${colors.border}`}>
          © {new Date().getFullYear()} Your Name — Built with React & Tailwind CSS
        </footer>
      </div>
    </Container>
  );
};

export default Home;