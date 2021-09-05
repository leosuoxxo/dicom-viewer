import HomePage from '../pages/Home';
import BackstageHomePage from '../pages/BackstageHome';
import BackstageLoginPage from '../pages/BackstageLogin';

export const routes = [
  {
    path: '/',
    component: HomePage,
    exact: true,
  },
];

export const backstageRoutes = [
  {
    path: '/backstage',
    component: BackstageHomePage,
    exact: true,
  },
  {
    path: '/backstage/login',
    component: BackstageLoginPage,
    exact: true,
  },
];
