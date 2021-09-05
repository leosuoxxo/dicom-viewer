import React from 'react';
import { AppRoutes } from './routes';
import { routes, backstageRoutes } from './routes/routesConfig';

function App() {
  return <AppRoutes routes={routes} backstageRoutes={backstageRoutes} />;
}

export default App;
