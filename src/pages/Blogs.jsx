import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Container from "../components/Container";
import usePortfolioStore from "../store/store";
import DriveImage from "../components/DriveImage";

export default function Blogs() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  
  const blogs = usePortfolioStore((s) => s.blogs || []);
  const fetchBlogsRemote = usePortfolioStore((s) => s.fetchBlogsRemote);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchBlogsRemote();
      setLoading(false);
    };
    loadData();
  }, [fetchBlogsRemote]);

  if (loading) {
    return (
      <Container>
        <div className={`${colors.background.secondary} rounded-lg p-12 text-center`}>
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mb-4"></div>
          <p className={colors.text.secondary}>Loading blog posts...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${colors.text.primary}`}>Blog</h1>
          <p className={colors.text.secondary}>Technical writing, tutorials, and insights.</p>
        </div>

        {/* Blog List */}
        {blogs.length === 0 ? (
          <div className={`${colors.background.secondary} rounded-lg p-12 text-center`}>
            <svg className={`mx-auto h-16 w-16 ${colors.text.muted} mb-4`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className={colors.text.secondary}>No blog posts found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/blogs/${blog.id}`}
                className={`${colors.background.primary} rounded-lg border ${colors.border} overflow-hidden hover:shadow-lg transition-all block`}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-64 h-48 md:h-auto overflow-hidden bg-gradient-to-br from-purple-400 to-pink-600 flex-shrink-0">
                    <DriveImage
                      src={blog.blogImageUrl}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                      fallback={
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                      }
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1">
                    <h3 className={`text-2xl font-semibold mb-2 ${colors.text.primary}`}>
                      {blog.title}
                    </h3>
                    {blog.date && (
                      <div className="flex items-center gap-2 mb-3">
                        <svg className={`w-4 h-4 ${colors.text.muted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <time className={`text-sm ${colors.text.secondary}`}>
                          {new Date(blog.date).toLocaleDateString()}
                        </time>
                      </div>
                    )}
                    <p className={`${colors.text.secondary} line-clamp-3`}>
                      {blog.summary || 'No summary available.'}
                    </p>
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