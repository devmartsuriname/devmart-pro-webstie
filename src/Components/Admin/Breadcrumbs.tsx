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
    <nav className="flex items-center gap-2 text-xs">
      <Link
        to="/admin"
        className="text-slate-400 hover:text-slate-200 transition-colors"
      >
        Home
      </Link>
      
      {pathnames.map((segment, index) => {
        const path = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
        if (segment === 'admin' && index === 0) return null;
        
        return (
          <div key={path} className="flex items-center gap-2">
            <span className="text-slate-600">/</span>
            {isLast ? (
              <span className="text-slate-300 font-medium">
                {getBreadcrumbLabel(segment)}
              </span>
            ) : (
              <Link
                to={path}
                className="text-slate-400 hover:text-slate-200 transition-colors"
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
