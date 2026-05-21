import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Layout } from './components/layout/Layout';
import { EventDetailPage } from './pages/EventDetailPage';
import { EventListPage } from './pages/EventListPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/eventos', element: <EventListPage /> },
      { path: '/eventos/:id', element: <EventDetailPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
