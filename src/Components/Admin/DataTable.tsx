import { Table, Trash2, Edit, Eye, Plus } from 'lucide-react';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  onCreate?: () => void;
  loading?: boolean;
  title: string;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  onEdit,
  onDelete,
  onView,
  onCreate,
  loading,
  title,
  emptyMessage = 'No items found',
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div style={{ 
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(51, 65, 85, 0.5)',
        borderRadius: '20px',
        padding: '40px',
        textAlign: 'center',
      }}>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(51, 65, 85, 0.5)',
      borderRadius: '20px',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '24px',
        borderBottom: '1px solid rgba(51, 65, 85, 0.5)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#f1f5f9', margin: 0 }}>{title}</h2>
        {onCreate && (
          <button
            onClick={onCreate}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.4)';
            }}
          >
            <Plus style={{ width: '18px', height: '18px' }} />
            <span>Create New</span>
          </button>
        )}
      </div>

      {/* Table */}
      {data.length === 0 ? (
        <div style={{ padding: '60px 24px', textAlign: 'center' }}>
          <Table style={{ width: '48px', height: '48px', color: '#475569', margin: '0 auto 16px' }} />
          <p style={{ color: '#94a3b8', fontSize: '16px', margin: 0 }}>{emptyMessage}</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(30, 41, 59, 0.5)', borderBottom: '1px solid rgba(51, 65, 85, 0.5)' }}>
                {columns.map((column, index) => (
                  <th
                    key={String(column.key)}
                    style={{
                      padding: '16px 24px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {column.label}
                  </th>
                ))}
                {(onView || onEdit || onDelete) && (
                  <th
                    style={{
                      padding: '16px 24px',
                      textAlign: 'right',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item, rowIndex) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: rowIndex < data.length - 1 ? '1px solid rgba(51, 65, 85, 0.3)' : 'none',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(30, 41, 59, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      style={{
                        padding: '16px 24px',
                        fontSize: '14px',
                        color: '#e2e8f0',
                      }}
                    >
                      {column.render
                        ? column.render(item)
                        : String((item as any)[column.key] || '-')}
                    </td>
                  ))}
                  {(onView || onEdit || onDelete) && (
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        {onView && (
                          <button
                            onClick={() => onView(item)}
                            style={{
                              padding: '8px',
                              background: 'rgba(59, 130, 246, 0.1)',
                              border: '1px solid rgba(59, 130, 246, 0.3)',
                              borderRadius: '8px',
                              color: '#3b82f6',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                            }}
                            title="View"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                            }}
                          >
                            <Eye style={{ width: '16px', height: '16px' }} />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            style={{
                              padding: '8px',
                              background: 'rgba(99, 102, 241, 0.1)',
                              border: '1px solid rgba(99, 102, 241, 0.3)',
                              borderRadius: '8px',
                              color: '#6366f1',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                            }}
                            title="Edit"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                            }}
                          >
                            <Edit style={{ width: '16px', height: '16px' }} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            style={{
                              padding: '8px',
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '8px',
                              color: '#ef4444',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                            }}
                            title="Delete"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                            }}
                          >
                            <Trash2 style={{ width: '16px', height: '16px' }} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
