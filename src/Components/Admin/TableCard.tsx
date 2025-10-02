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
          <thead className="sticky top-16 z-10 bg-slate-800 text-slate-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`border-b border-slate-700 px-3 py-2.5 text-left font-medium ${col.className || ''}`}
                >
                  {col.label}
                </th>
              ))}
              {renderActions && (
                <th className="w-32 border-b border-slate-700 px-3 py-2.5 text-right font-medium">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, idx) => (
              <tr
                key={row.id || idx}
                className="border-b border-slate-800 hover:bg-slate-800/60 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-3 py-2.5 text-slate-200 truncate ${col.className || ''}`}
                  >
                    {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '-')}
                  </td>
                ))}
                {renderActions && (
                  <td className="px-3 py-2.5 text-right">
                    {renderActions(row)}
                  </td>
                )}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (renderActions ? 1 : 0)}
                  className="px-3 py-10 text-center text-slate-400"
                >
                  {search ? 'No results found' : 'No data available'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-800 p-3 text-xs text-slate-400">
        <div>Showing {filtered.length} of {data.length} rows</div>
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <button className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 hover:bg-slate-700">25</button>
        </div>
      </div>
    </div>
  );
}
