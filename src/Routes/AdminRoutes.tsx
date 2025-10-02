import { Navigate } from 'react-router-dom';
import AdminLayout from '@/Components/Admin/AdminLayout';
import AdminLogin from '@/Pages/AdminLogin';
import Dashboard from '@/Pages/Admin/Dashboard';
import Services from '@/Pages/Admin/Services';

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
        element: <div className="p-6">Projects (Coming Soon)</div>,
      },
      {
        path: 'blog',
        element: <div className="p-6">Blog (Coming Soon)</div>,
      },
    ],
  },
];
