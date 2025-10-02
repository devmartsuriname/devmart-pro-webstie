import AdminLayout from '@/Components/Admin/AdminLayout';
import AdminLogin from '@/Pages/AdminLogin';
import ProtectedRoute from '@/Components/Admin/ProtectedRoute';
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
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'services',
        element: (
          <ProtectedRoute requiredRole={['admin', 'editor']}>
            <Services />
          </ProtectedRoute>
        ),
      },
      {
        path: 'projects',
        element: (
          <ProtectedRoute requiredRole={['admin', 'editor']}>
            <Projects />
          </ProtectedRoute>
        ),
      },
      {
        path: 'blog',
        element: (
          <ProtectedRoute requiredRole={['admin', 'editor', 'author']}>
            <Blog />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
