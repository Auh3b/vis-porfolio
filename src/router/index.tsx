import { createBrowserRouter, RouteObject } from 'react-router';
import Layout from '../pages/Layout';
import NotFound from '../pages/NotFound';

import { lazy } from 'react';

const Home = lazy(() => import('../pages/Home'));
const Projects = lazy(() => import('../pages/Projects'));
const Project = lazy(() => import('../pages/Projects/[id]'));
const Catalogue = lazy(() => import('../pages/Catalogue'));
const CatalogueView = lazy(() => import('../pages/Catalogue/CatalogueView'));
const SimpleMapDemo = lazy(() => import('../pages/demos/SimpleMapDemo'));
const ComplexMapDemo = lazy(() => import('../pages/demos/ComplexMapDemo'));
const SpatialDashboardDemo = lazy(
  () => import('../pages/demos/SpatialDashboardDemo'),
);

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'projects',
        element: <Projects />,
      },
      {
        path: 'projects/:id',
        element: <Project />,
      },
      {
        path: 'catalogue',
        element: <Catalogue />,
      },
      {
        path: 'catalogue/:id',
        element: <CatalogueView />,
      },
      {
        path: 'demo/simple-map',
        element: <SimpleMapDemo />,
      },
      {
        path: 'demo/complex-map',
        element: <ComplexMapDemo />,
      },
      {
        path: 'demo/spatial-dashboard',
        element: <SpatialDashboardDemo />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

const router = createBrowserRouter(routes);

export default router;
