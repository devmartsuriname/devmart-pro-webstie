import AdminLayout from '@/Components/Admin/AdminLayout';
import AdminLogin from '@/Pages/AdminLogin';
import ForgotPassword from '@/Pages/Admin/ForgotPassword';
import ResetPassword from '@/Pages/Admin/ResetPassword';
import ProtectedRoute from '@/Components/Admin/ProtectedRoute';
import Dashboard from '@/Pages/Admin/Dashboard';
import Services from '@/Pages/Admin/Services';
import ServiceForm from '@/Pages/Admin/ServiceForm';
import Projects from '@/Pages/Admin/Projects';
import Blog from '@/Pages/Admin/Blog';
import Pricing from '@/Pages/Admin/Pricing';
import FAQ from '@/Pages/Admin/FAQ';

export const adminRoutes = [
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/admin/reset-password',
    element: <ResetPassword />,
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
        path: 'services/new',
        element: (
          <ProtectedRoute requiredRole={['admin', 'editor']}>
            <ServiceForm />
          </ProtectedRoute>
        ),
      },
      {
        path: 'services/:id/edit',
        element: (
          <ProtectedRoute requiredRole={['admin', 'editor']}>
            <ServiceForm />
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
      {
        path: 'pricing',
        element: (
          <ProtectedRoute requiredRole={['admin', 'editor']}>
            <Pricing />
          </ProtectedRoute>
        ),
      },
      {
        path: 'faq',
        element: (
          <ProtectedRoute requiredRole={['admin', 'editor']}>
            <FAQ />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
