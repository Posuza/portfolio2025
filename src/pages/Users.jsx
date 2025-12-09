import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import Container from "../components/Container";
import usePortfolioStore from "../store/store";
import { getImageSrc } from "../utils/imageUrl";

export default function Users() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  
  const users = usePortfolioStore((s) => s.users || []);
  const fetchRemote = usePortfolioStore((s) => s.fetchRemote);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchRemote();
      setLoading(false);
    };
    loadData();
  }, [fetchRemote]);

  if (loading) {
    return (
      <Container>
        <div className={`${colors.background.secondary} rounded-lg p-12 text-center`}>
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mb-4"></div>
          <p className={colors.text.secondary}>Loading users...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${colors.text.primary}`}>Users</h1>
          <p className={colors.text.secondary}>Manage user accounts and permissions.</p>
        </div>

        {/* Users Table */}
        {users.length === 0 ? (
          <div className={`${colors.background.secondary} rounded-lg p-12 text-center`}>
            <svg className={`mx-auto h-16 w-16 ${colors.text.muted} mb-4`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className={colors.text.secondary}>No users found.</p>
          </div>
        ) : (
          <div className={`${colors.background.primary} rounded-lg border ${colors.border} overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${colors.background.secondary} border-b ${colors.border}`}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${colors.text.muted} uppercase tracking-wider`}>
                      User
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${colors.text.muted} uppercase tracking-wider`}>
                      Email
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${colors.text.muted} uppercase tracking-wider`}>
                      Role
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${colors.text.muted} uppercase tracking-wider`}>
                      Bio
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center">
                            {user.profileImageUrl ? (
                              <img
                                src={getImageSrc(user.profileImageUrl)}
                                alt={user.username}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                              </svg>
                            )}
                          </div>
                          <div>
                            <div className={`text-sm font-medium ${colors.text.primary}`}>
                              {user.username}
                            </div>
                            <div className={`text-xs ${colors.text.muted}`}>
                              ID: {user.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${colors.text.secondary}`}>
                        {user.email || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm ${colors.text.secondary} max-w-xs truncate`}>
                        {user.bio || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}