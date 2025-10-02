import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const getBreadcrumbLabel = (segment: string) => {
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <nav className="flex items-center gap-2 text-sm">
      <Link
        to="/admin"
        className="text-[hsl(var(--admin-text-secondary))] hover:text-[hsl(var(--admin-brand-1))] transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {pathnames.map((segment, index) => {
        const path = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
        if (segment === 'admin' && index === 0) return null;
        
        return (
          <div key={path} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-[hsl(var(--admin-text-muted))]" />
            {isLast ? (
              <span className="text-[hsl(var(--admin-text-primary))] font-medium">
                {getBreadcrumbLabel(segment)}
              </span>
            ) : (
              <Link
                to={path}
                className="text-[hsl(var(--admin-text-secondary))] hover:text-[hsl(var(--admin-brand-1))] transition-colors"
              >
                {getBreadcrumbLabel(segment)}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
