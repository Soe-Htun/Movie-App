import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'search'
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./features/search/search.page').then((m) => m.SearchPage)
  },
  {
    path: 'movie/:id',
    loadComponent: () =>
      import('./features/details/details.page').then((m) => m.DetailsPage)
  },
  {
    path: 'watchlist',
    loadComponent: () =>
      import('./features/watchlist/watchlist.page').then((m) => m.WatchlistPage)
  },
  {
    path: '**',
    redirectTo: 'search'
  }
];
