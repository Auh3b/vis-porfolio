import { createBrowserRouter, RouteObject } from 'react-router';
import Layout from '../pages/Layout';
import Home from '../pages/Home';
import Projects from '../pages/Projects';
import Project from '../pages/Projects/[id]';
import Catalogue from '../pages/Catalogue';
import CatalogueView from '../pages/Catalogue/CatalogueView';
import NotFound from '../pages/NotFound';
import SimpleMapDemo from '../pages/demos/SimpleMapDemo';
import ComplexMapDemo from '../pages/demos/ComplexMapDemo';
import SpatialDashboardDemo from '../pages/demos/SpatialDashboardDemo';

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
