import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import { NotesProvider } from './context/NotesContext';
import './index.css';
import { router } from './router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FavoritesProvider>
      <NotesProvider>
        <RouterProvider router={router} />
      </NotesProvider>
    </FavoritesProvider>
  </StrictMode>
);
