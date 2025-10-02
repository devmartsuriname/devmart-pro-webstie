import { Navigate } from 'react-router-dom';
import Services from '@/Pages/Admin/Services';
import Projects from '@/Pages/Admin/Projects';
import Blog from '@/Pages/Admin/Blog';

// Temporary placeholder until full admin rebuild
export const adminRoutes = [
  {
    path: '/admin',
    element: <Navigate to="/admin/services" replace />,
  },
  {
    path: '/admin/services',
    element: <Services />,
  },
  {
    path: '/admin/projects',
    element: <Projects />,
  },
  {
    path: '/admin/blog',
    element: <Blog />,
  },
];
