import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((c) => c.Home),
  },
  {
    path: 'books/:isbn',
    loadComponent: () => import('./features/book/book').then((c) => c.Book),
  },
  {
    path: 'categories/:category',
    loadComponent: () => import('./features/home/home').then((c) => c.Home),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./features/favorites/favorites').then((c) => c.Favorites),
  },
];
