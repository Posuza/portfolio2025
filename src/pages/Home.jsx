import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Container from "../components/Container";
import usePortfolioStore from "../store/store";
import DriveImage from "../components/DriveImage";

const SECTIONS = [
  {
    key: "projects",
    title: "Projects",
    path: "/projects",
    desc: "Production apps, demos and utilities.",
  },
  {
    key: "educations",
    title: "Education",
    path: "/educations",
    desc: "Academic background & courses.",
  },
  {
    key: "workExperiences",
    title: "Work",
    path: "/work-experiences",
    desc: "Professional experience & roles.",
  },
  {
    key: "references",
    title: "References",
    path: "/references",
    desc: "Recommendations & contacts.",
  },
  {
    key: "blogs",
    title: "Blog",
    path: "/blogs",
    desc: "Technical writing & notes.",
  },
];

const Home = () => {
  const { colors } = useTheme();
  const projects = usePortfolioStore((s) => s.projects || []);
  const fetchProjectsRemote = usePortfolioStore((s) => s.fetchProjectsRemote);
  const references = usePortfolioStore((s) => s.references || []);
  const fetchReferencesRemote = usePortfolioStore(
    (s) => s.fetchReferencesRemote
  );

  useEffect(() => {
    if (typeof fetchProjectsRemote === "function") {
      fetchProjectsRemote().catch(() => {});
    }
  }, [fetchProjectsRemote]);

  useEffect(() => {
    if (typeof fetchReferencesRemote === "function") {
      fetchReferencesRemote().catch(() => {});
    }
  }, [fetchReferencesRemote]);

  const preview = (projects || []).slice(0, 6);

  return (
    <>
      <Container>
        <div className="pt-10 ">
          {/* HERO */}
          <div className="max-w-5xl mx-auto px-4 flex flex-col-reverse md:flex-row md:items-center gap-8">
            <div className="w-full md:w-1/2">
              <h2
                className={`text-lg md:text-xl font-extrabold leading-tight ${colors.text.primary}`}
              >
                Paing Hein Thet Mon (Software and IOT Engineer)
              </h2>
              <p
                className={`text-sm sm:text-base md:text-sm mt-4 ${colors.text.secondary}`}
              >
                A dedicated Associate Software and IoT Engineer based in Bangkok
                , focused on designing and delivering robust web, cloud, and
                embedded solutions. I blend practical expertise in software
                development, infrastructure management, and IoT systems with a
                unique specialization in AI and Quantum Computing. My proven
                ability includes designing scalable hosting architectures on
                clouds and self-host infrastructure by utilizing advanced
                technical skills, including Quantum Algorithm Design and
                containerization with Docker/Kubernetes. With over four years in
                management and IT support roles , I am committed to continuous
                learning and delivering reliable, innovative, and
                well-engineered solutions within dynamic teams
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-block text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition ${colors.button.primary}`}
                >
                  Download Resume
                </a>
                <a
                  href="mailto:you@example.com"
                  className={`inline-block text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded transition ${colors.text.muted} hover:${colors.text.secondary}`}
                >
                  Contact
                </a>
              </div>
            </div>

            <div className="w-full md:w-1/2 flex justify-center">
              <div
                className={`w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 rounded-xl overflow-hidden ${colors.background.tertiary} flex items-center justify-center shadow-lg mx-auto`}
              >
                <img
                  src="/images/profile.jpg"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* SECTIONS */}
          <section className="max-w-7xl mx-auto px-4 mt-16">
            <h2
              className={`text-xl sm:text-2xl font-semibold mb-6 ${colors.text.primary}`}
            >
              Explore
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 md:gap-4">
              {SECTIONS.map((s) => (
                <Link
                  key={s.key}
                  to={s.path}
                  className={`block p-4 sm:p-6 ${colors.background.primary} border ${colors.border} rounded-lg hover:shadow-md transition-all hover:scale-105`}
                >
                  <div
                    className={`text-base sm:text-lg font-medium ${colors.text.primary}`}
                  >
                    {s.title}
                  </div>
                  <div
                    className={`text-[11px] sm:text-xs md:text-sm ${colors.text.muted} mt-2`}
                  >
                    {s.desc}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* PROJECTS PREVIEW */}
          <section className="max-w-7xl mx-auto px-4 mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2
                className={`text-xl sm:text-2xl font-semibold ${colors.text.primary}`}
              >
                Selected Projects
              </h2>
              <Link
                to="/projects"
                className={`${colors.button.secondary} px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition`}
              >
                See all →
              </Link>
            </div>

            {preview.length === 0 ? (
              <div
                className={`${colors.background.secondary} rounded-lg p-8 sm:p-12 text-center`}
              >
                <svg
                  className={`mx-auto h-10 w-10 sm:h-12 sm:w-12 ${colors.text.muted} mb-4`}
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
                <p className={`text-sm sm:text-base ${colors.text.secondary}`}>
                  No projects available yet
                </p>
                <p className={`text-sm ${colors.text.muted} mt-2`}>
                  Add projects in the admin panel or sync your data.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {preview.map((p) => (
                  <article
                    key={p.id || p.name}
                    className={`${colors.background.primary} border ${colors.border} rounded-lg overflow-hidden hover:shadow-lg transition-shadow`}
                  >
                    <div className="w-full h-36 sm:h-40 bg-gradient-to-br from-sky-400 to-blue-600">
                      <DriveImage
                        src={p.projectsImageUrl}
                        alt={p.name}
                        className="w-full h-full object-cover"
                        fallback={
                          <div className="w-full h-full flex items-center justify-center">
                            <svg
                              className="w-10 h-10 text-white opacity-50"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        }
                      />
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3
                        className={`font-semibold text-base sm:text-lg ${colors.text.primary}`}
                      >
                        {p.name}
                      </h3>
                      <p
                        className={`text-sm sm:text-base ${colors.text.secondary} mt-2 line-clamp-3`}
                      >
                        {p.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <Link
                          to={`/projects/${p.id || ""}`}
                          className={`text-sm ${colors.button.secondary} px-3 py-1 rounded transition`}
                        >
                          View Details
                        </Link>
                        {p.tags && (
                          <span className={`text-xs ${colors.text.muted}`}>
                            {p.tags}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* RECOMMENDATIONS / TESTIMONIALS */}
          <section className="max-w-5xl mx-auto px-4 mt-12 sm:mt-16">
            <div className="flex items-start sm:items-center justify-between mb-4 sm:mb-6">
              <h2
                className={`text-xl sm:text-2xl font-semibold ${colors.text.primary}`}
              >
                Recommendations
              </h2>
              <Link
                to="/references"
                className={`${colors.button.secondary} px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition`}
              >
                View all
              </Link>
            </div>
            {references.length === 0 ? (
              <div
                className={`${colors.background.secondary} rounded-lg p-6 sm:p-8 text-center`}
              >
                <p className={`text-sm sm:text-base ${colors.text.secondary}`}>
                  No recommendations yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {references.slice(0, 3).map((ref) => (
                  <div
                    key={ref.id}
                    className={`${colors.background.primary} border ${colors.border} rounded-lg p-4 sm:p-6 shadow hover:shadow-lg transition`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
                        <DriveImage
                          src={ref.referenceImageUrl}
                          alt={ref.name}
                          className="w-full h-full object-cover"
                          fallback={
                            <svg
                              className="w-6 h-6 text-white"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                          }
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-base sm:text-lg font-semibold ${colors.text.primary} truncate`}
                        >
                          {ref.name}
                        </h3>
                        {ref.relationship && (
                          <p
                            className={`text-[11px] sm:text-xs ${colors.text.secondary} truncate`}
                          >
                            {ref.relationship}
                          </p>
                        )}
                        {ref.company && (
                          <p
                            className={`text-[11px] sm:text-xs ${colors.text.muted} truncate`}
                          >
                            {ref.company}
                          </p>
                        )}
                      </div>
                    </div>
                    {ref.testimonial && (
                      <p
                        className={`text-sm sm:text-base italic ${colors.text.secondary} mt-2 line-clamp-4`}
                      >
                        {ref.testimonial}
                      </p>
                    )}
                    {ref.contact && (
                      <p
                        className={`text-xs sm:text-sm mt-2 ${colors.text.muted}`}
                      >
                        {ref.contact}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </Container>
    </>
  );
};

export default Home;
