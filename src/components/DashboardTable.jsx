import React, { useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function DashboardTable({ 
  data = [], 
  fields = [], 
  onEdit, 
  onDelete, 
  loading = false,
  submitting = false 
}) {
  const { colors } = useTheme();
  const headerRef = useRef(null);
  const bodyRef = useRef(null);

  const syncScroll = (source) => {
    if (source === 'header' && bodyRef.current) {
      bodyRef.current.scrollLeft = headerRef.current.scrollLeft;
    } else if (source === 'body' && headerRef.current) {
      headerRef.current.scrollLeft = bodyRef.current.scrollLeft;
    }
  };

  if (loading) {
    return (
      <div className={`${colors.background.secondary} rounded-lg p-12 text-center`}>
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mb-4"></div>
        <p className={colors.text.secondary}>Loading...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`${colors.background.secondary} rounded-lg p-12 text-center`}>
        <p className={colors.text.secondary}>No items found. Click "Add New" to create one.</p>
      </div>
    );
  }

  return (
    <div className={`relative shadow-lg border ${colors.border} ${colors.background.primary} rounded-lg overflow-hidden`}>
      {/* Header Table */}
      <div
        ref={headerRef}
        className="overflow-x-auto"
        style={{ width: '100%' }}
        onScroll={() => syncScroll('header')}
      >
        <table
          className="w-full text-sm text-left"
          style={{ tableLayout: 'fixed', minWidth: '600px' }}
        >
          <colgroup>
            <col className="w-[60px]" />
            {fields.map((field, idx) => (
              <col key={field.name} className={`${idx === 0 ? 'w-[150px]' : 'w-[200px]'}`} />
            ))}
            <col className="w-[100px]" />
          </colgroup>
          <thead className={`${colors.background.secondary} border-b ${colors.border}`}>
            <tr>
              <th className={`px-3 py-3 text-left text-xs font-medium ${colors.text.muted} uppercase`}>
                ID
              </th>
              {fields.map((field) => (
                <th key={field.name} className={`px-4 py-3 text-left text-xs font-medium ${colors.text.muted} uppercase`}>
                  {field.label}
                </th>
              ))}
              <th className={`px-6 py-3 text-right text-xs font-medium ${colors.text.muted} uppercase`}>
                Actions
              </th>
            </tr>
          </thead>
        </table>
      </div>

      {/* Body Table */}
      <div
        ref={bodyRef}
        className="overflow-x-auto"
        style={{ maxHeight: '400px', overflowY: 'auto', width: '100%' }}
        onScroll={() => syncScroll('body')}
      >
        <table
          className="w-full text-sm text-left"
          style={{ tableLayout: 'fixed', minWidth: '600px' }}
        >
          <colgroup>
            <col className="w-[60px]" />
            {fields.map((field, idx) => (
              <col key={field.name} className={`${idx === 0 ? 'w-[150px]' : 'w-[200px]'}`} />
            ))}
            <col className="w-[100px]" />
          </colgroup>
          <tbody className={`divide-y ${colors.border}`}>
            {data.map((item, index) => (
              <tr key={item.id} className={`hover:${colors.background.secondary} transition`}>
                <td className={`px-3 py-4 whitespace-nowrap text-sm ${colors.text.muted}`}>
                  #{index + 1}
                </td>
                {fields.map((field) => (
                  <td key={field.name} className={`px-4 py-4 text-sm ${colors.text.secondary}`}>
                    {field.type === 'file' ? (
                      item[field.name] ? (
                        <span className="text-green-600 dark:text-green-400">✓ Image</span>
                      ) : (
                        <span className={colors.text.muted}>—</span>
                      )
                    ) : field.type === 'textarea' ? (
                      <span className="line-clamp-2 max-w-xs">{item[field.name] || '—'}</span>
                    ) : (
                      <span className="truncate block max-w-xs">{item[field.name] || '—'}</span>
                    )}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button
                    onClick={() => onEdit(item)}
                    disabled={submitting}
                    className={`text-sky-600 hover:text-sky-700 mr-4 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="Edit"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    disabled={submitting}
                    className={`text-red-600 hover:text-red-700 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="Delete"
                  >
                    {submitting ? (
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
