import { createBrowserRouter, RouteObject } from 'react-router';
import Layout from '../pages/Layout';
import Home from '../pages/Home';
import Projects from '../pages/Projects';
import Project from '../pages/Projects/[id]';

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
        path: 'project/:id',
        element: <Project />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
