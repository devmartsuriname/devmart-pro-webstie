import { Navigate } from 'react-router-dom';
import AdminLayout from '@/Components/Admin/AdminLayout';
import AdminLogin from '@/Pages/AdminLogin';
import Dashboard from '@/Pages/Admin/Dashboard';
import Services from '@/Pages/Admin/Services';
import Projects from '@/Pages/Admin/Projects';
import Blog from '@/Pages/Admin/Blog';

export const adminRoutes = [
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'services',
        element: <Services />,
      },
      {
        path: 'projects',
        element: <Projects />,
      },
      {
        path: 'blog',
        element: <Blog />,
      },
    ],
  },
];
