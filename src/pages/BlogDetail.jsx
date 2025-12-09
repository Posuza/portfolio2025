import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Container from "../components/Container";
import usePortfolioStore from "../store/store";
import DriveImage from "../components/DriveImage";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState(null);

  const blogs = usePortfolioStore((s) => s.blogs || []);
  const fetchBlogsRemote = usePortfolioStore((s) => s.fetchBlogsRemote);

  useEffect(() => {
    const loadBlog = async () => {
      setLoading(true);
      if (blogs.length === 0) {
        await fetchBlogsRemote();
      }
      const found = blogs.find((b) => String(b.id) === String(id));
      setBlog(found || null);
      setLoading(false);
    };
    loadBlog();
  }, [id, blogs, fetchBlogsRemote]);

  if (loading) {
    return (
      <Container>
        <div className={`${colors.background.secondary} rounded-lg p-12 text-center`}>
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mb-4"></div>
          <p className={colors.text.secondary}>Loading blog post...</p>
        </div>
      </Container>
    );
  }

  if (!blog) {
    return (
      <Container>
        <div className={`${colors.background.secondary} rounded-lg p-8 text-center`}>
          <svg className={`mx-auto h-16 w-16 ${colors.text.muted} mb-4`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className={`text-xl font-semibold mb-2 ${colors.text.primary}`}>Blog Post Not Found</h3>
          <p className={`mb-6 ${colors.text.secondary}`}>The blog post you're looking for doesn't exist.</p>
          <Link to="/blogs" className={`${colors.button.primary} px-6 py-3 rounded-lg transition inline-flex items-center gap-2`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blogs
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
            <li><Link to="/blogs" className={`${colors.text.secondary} hover:${colors.text.primary}`}>Blogs</Link></li>
            <li className={colors.text.muted}>/</li>
            <li className={colors.text.primary}>{blog.title}</li>
          </ol>
        </nav>

        {/* Main Content */}
        <article className={`${colors.background.primary} rounded-lg shadow-lg border ${colors.border} overflow-hidden`}>
          {/* Featured Image */}
          <div className="w-full h-96 overflow-hidden bg-gradient-to-br from-purple-400 to-pink-600">
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

          {/* Article Header */}
          <div className="p-8">
            <div className="mb-6">
              <h1 className={`text-4xl font-bold mb-4 ${colors.text.primary}`}>{blog.title}</h1>
              {blog.date && (
                <div className="flex items-center gap-2">
                  <svg className={`w-5 h-5 ${colors.text.muted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <time className={`text-sm ${colors.text.secondary}`}>{new Date(blog.date).toLocaleDateString()}</time>
                </div>
              )}
            </div>

            {/* Summary */}
            {blog.summary && (
              <div className={`${colors.background.secondary} rounded-lg p-6 mb-8`}>
                <h2 className={`text-lg font-semibold mb-2 ${colors.text.primary}`}>Summary</h2>
                <p className={`${colors.text.secondary} leading-relaxed`}>{blog.summary}</p>
              </div>
            )}

            {/* Additional Content */}
            <div className="prose dark:prose-invert max-w-none">
              {Object.entries(blog).map(([key, value]) => {
                if (['id', 'title', 'date', 'summary', 'blogImageUrl', 'imageId'].includes(key)) return null;
                return (
                  <div key={key} className="mb-6">
                    <h3 className={`text-lg font-semibold mb-2 ${colors.text.primary} capitalize`}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <p className={`${colors.text.secondary} leading-relaxed whitespace-pre-wrap`}>
                      {String(value || '—')}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Navigation */}
            <div className={`mt-8 pt-6 border-t ${colors.border} flex justify-between`}>
              <button
                onClick={() => navigate('/blogs')}
                className={`${colors.button.secondary} px-6 py-2 rounded-lg transition inline-flex items-center gap-2`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                All Posts
              </button>
            </div>
          </div>
        </article>
      </div>
    </Container>
  );
}