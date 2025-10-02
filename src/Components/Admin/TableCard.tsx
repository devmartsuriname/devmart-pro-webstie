import { useState, useMemo, ReactNode } from 'react';
import { Search, Plus } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  className?: string;
  render?: (value: any, row: any) => ReactNode;
}

interface TableCardProps {
  title: string;
  description?: string;
  columns: Column[];
  data: any[];
  onNew?: () => void;
  renderActions?: (row: any) => ReactNode;
}

export function TableCard({
  title,
  description,
  columns,
  data,
  onNew,
  renderActions,
}: TableCardProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return data;
    return data.filter((row) => 
      JSON.stringify(Object.values(row)).toLowerCase().includes(s)
    );
  }, [data, search]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 p-4">
        <div>
          <div className="text-base font-semibold text-slate-100">{title}</div>
          {description && <div className="text-sm text-slate-400">{description}</div>}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-300 focus-within:ring-2 focus-within:ring-blue-500/40">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="bg-transparent placeholder:text-slate-500 focus:outline-none text-sm w-32"
            />
          </div>
          {onNew && (
            <button
              onClick={onNew}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
            >
              <Plus className="h-4 w-4" /> New
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse text-sm">
          <thead className="sticky top-16 z-10 bg-slate-800/95 backdrop-blur-sm text-slate-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`border-b border-slate-700 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${col.className || ''}`}
                >
                  {col.label}
                </th>
              ))}
              {renderActions && (
                <th className="w-36 border-b border-slate-700 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, idx) => (
              <tr
                key={row.id || idx}
                className={`border-b border-slate-800 hover:bg-slate-800/50 transition-colors ${
                  idx % 2 === 0 ? 'bg-slate-900' : 'bg-slate-900/50'
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3.5 text-slate-200 truncate ${col.className || ''}`}
                  >
                    {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '-')}
                  </td>
                ))}
                {renderActions && (
                  <td className="px-4 py-3.5 text-right">
                    {renderActions(row)}
                  </td>
                )}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (renderActions ? 1 : 0)}
                  className="px-4 py-12 text-center"
                >
                  <div className="text-slate-500 font-medium">
                    {search ? 'No results found' : 'No data available'}
                  </div>
                  {search && (
                    <div className="text-xs text-slate-600 mt-1">
                      Try adjusting your search terms
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-800 px-4 py-3 text-xs">
        <div className="text-slate-400">
          Showing <span className="font-medium text-slate-300">{filtered.length}</span> of{' '}
          <span className="font-medium text-slate-300">{data.length}</span> rows
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-500">Density:</span>
          <div className="flex items-center gap-1">
            <button className="rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors text-xs">
              Compact
            </button>
            <button className="rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors text-xs">
              Comfort
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
