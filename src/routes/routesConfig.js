import HomePage from '../pages/Home';
import BackstageHomePage from '../pages/BackstageHome';

export const routes = [
  {
    path: '/',
    component: HomePage,
    exact: true,
  },
  {
    path: '/backstage',
    component: BackstageHomePage,
    exact: true,
  },
];
