import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  const [search, setSearch] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('asc');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const searchableFields = useMemo(() => fields.map((f) => f.name), [fields]);

  const filteredData = useMemo(() => {
    const q = String(search || '').trim().toLowerCase();
    if (!q) return data;
    return data.filter((item) => {
      if (searchField === 'id') return String(item?.id ?? '').toLowerCase().includes(q);
      if (searchField !== 'all') {
        return String(item?.[searchField] ?? '').toLowerCase().includes(q);
      }
      if (String(item?.id ?? '').toLowerCase().includes(q)) return true;
      return searchableFields.some((key) =>
        String(item?.[key] ?? '').toLowerCase().includes(q),
      );
    });
  }, [data, search, searchField, searchableFields]);

  const sortedData = useMemo(() => {
    const arr = [...filteredData];
    arr.sort((a, b) => {
      const va = sortBy === 'id' ? a?.id : a?.[sortBy];
      const vb = sortBy === 'id' ? b?.id : b?.[sortBy];
      const sa = String(va ?? '').toLowerCase();
      const sb = String(vb ?? '').toLowerCase();
      const cmp = sa.localeCompare(sb, undefined, { numeric: true, sensitivity: 'base' });
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return arr;
  }, [filteredData, sortBy, sortDir]);

  const total = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * rowsPerPage;
  const pageData = sortedData.slice(start, start + rowsPerPage);

  useEffect(() => {
    setPage(1);
  }, [search, searchField, rowsPerPage]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

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

  if (total === 0) {
    return (
      <div className={`${colors.background.secondary} rounded-lg p-12 text-center`}>
        <p className={colors.text.secondary}>No matching results.</p>
      </div>
    );
  }

  const onSort = (key) => {
    if (sortBy === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortBy(key);
    setSortDir('asc');
  };

  const generatePaginationNumbers = () => {
    const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 640;
    const maxVisiblePages = isSmallScreen ? 2 : 7;
    const pages = [];
    let startPage = Math.max(1, safePage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const renderCell = (item, field) => {
    const value = item?.[field.name];
    if (field.type === 'file') {
      return value ? (
        <span className="text-green-600 dark:text-green-400">Yes</span>
      ) : (
        <span className={colors.text.muted}>—</span>
      );
    }
    if (field.type === 'textarea') {
      return <span className="line-clamp-2 max-w-xs">{value || '—'}</span>;
    }
    return <span className="truncate block max-w-xs">{value || '—'}</span>;
  };

  return (
    <div className={`relative shadow-lg border ${colors.border} ${colors.background.primary} rounded-lg overflow-hidden`}>
      <div className={`p-3 sm:p-4 border-b ${colors.border} ${colors.background.secondary}`}>
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className={`px-2 py-1 rounded border ${colors.border} ${colors.background.primary} ${colors.text.primary} text-sm`}
            >
              <option value="all">All</option>
              <option value="id">ID</option>
              {fields.map((f) => (
                <option key={f.name} value={f.name}>
                  {f.label}
                </option>
              ))}
            </select>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className={`px-3 py-1.5 rounded border ${colors.border} ${colors.background.primary} ${colors.text.primary} text-sm w-56`}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs ${colors.text.muted}`}>Rows</span>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className={`px-2 py-1 rounded border ${colors.border} ${colors.background.primary} ${colors.text.primary} text-sm`}
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span className={`text-xs ${colors.text.muted}`}>{total} items</span>
          </div>
        </div>
      </div>

      <div className="md:hidden divide-y">
        {pageData.map((item, idx) => (
          <div key={item.id || `row-${idx}`} className={`p-3 ${colors.background.primary}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs ${colors.text.muted}`}>ID</span>
              <span className={`text-sm font-semibold ${colors.text.primary}`}>{item?.id || '—'}</span>
            </div>
            <div className="grid grid-cols-1 gap-2 mb-3">
              {fields.map((field) => (
                <div key={field.name} className="flex items-start justify-between gap-3">
                  <span className={`text-xs ${colors.text.muted}`}>{field.label}</span>
                  <div className={`text-sm ${colors.text.secondary} text-right`}>{renderCell(item, field)}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => onEdit && onEdit(item)}
                disabled={submitting}
                className={`px-2 py-1 rounded text-xs bg-sky-500 text-white ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Edit
              </button>
              <button
                onClick={() => onDelete && onDelete(item)}
                disabled={submitting}
                className={`px-2 py-1 rounded text-xs bg-red-500 text-white ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block">
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
              <th
                className={`px-3 py-3 text-left text-xs font-medium ${colors.text.muted} uppercase cursor-pointer`}
                onClick={() => onSort('id')}
              >
                ID
                {sortBy === 'id' ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}
              </th>
              {fields.map((field) => (
                <th
                  key={field.name}
                  className={`px-4 py-3 text-left text-xs font-medium ${colors.text.muted} uppercase cursor-pointer`}
                  onClick={() => onSort(field.name)}
                >
                  {field.label}
                  {sortBy === field.name ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}
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
            {pageData.map((item) => (
              <tr key={item.id} className={`hover:${colors.background.secondary} transition`}>
                <td className={`px-3 py-4 whitespace-nowrap text-sm ${colors.text.muted}`}>
                  {item?.id || '—'}
                </td>
                {fields.map((field) => (
                  <td key={field.name} className={`px-4 py-4 text-sm ${colors.text.secondary}`}>
                    {renderCell(item, field)}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button
                    onClick={() => onEdit && onEdit(item)}
                    disabled={submitting}
                    className={`text-sky-600 hover:text-sky-700 mr-4 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="Edit"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(item)}
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

      <div className={`flex items-center justify-between gap-3 p-3 sm:p-4 border-t ${colors.border} ${colors.background.secondary}`}>
        <div className={`text-xs ${colors.text.muted}`}>
          Page {safePage} of {totalPages}
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          {safePage > 1 && (
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={`px-2 py-1 text-xs rounded border ${colors.border}`}
              aria-label="Previous page"
            >
              Prev
            </button>
          )}
          {generatePaginationNumbers().map((p, idx) =>
            p === '...' ? (
              <span key={`ellipsis-${idx}`} className={`px-1 text-xs ${colors.text.muted}`}>
                ...
              </span>
            ) : (
              <button
                key={`page-${p}`}
                onClick={() => setPage(p)}
                className={`px-2 py-1 text-xs rounded border ${colors.border} ${
                  safePage === p ? 'bg-sky-500 text-white' : ''
                }`}
                aria-current={safePage === p ? 'page' : undefined}
              >
                {p}
              </button>
            ),
          )}
          {safePage < totalPages && (
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className={`px-2 py-1 text-xs rounded border ${colors.border}`}
              aria-label="Next page"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
