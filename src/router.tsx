import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { About } from './pages/About';
import { Favorites } from './pages/Favorites';
import { Home } from './pages/Home';
import { MovieDetail } from './pages/MovieDetail';
import { MovieNotesTab } from './pages/MovieNotesTab';
import { MovieSummaryTab } from './pages/MovieSummaryTab';
import { Notes } from './pages/Notes';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'movies/:id',
        element: <MovieDetail />,
        children: [
          {
            index: true,
            element: <MovieSummaryTab />,
          },
          {
            path: 'notes',
            element: <MovieNotesTab />,
          },
        ],
      },
      {
        path: 'favorites',
        element: <Favorites />,
      },
      {
        path: 'notes',
        element: <Notes />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
