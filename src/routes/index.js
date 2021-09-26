import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import { map } from 'lodash';
import { FirebaseAuthProvider } from '../services/firebaseAuthService';

export const RouteView = (route) => {
  return (
    <Route
      path={route.path}
      exact={route.exact}
      render={(props) => (
        <route.component {...props} {...route} routes={route.routes} />
      )}
    />
  );
};

export const AppRoutes = ({ routes = [], backstageRoutes = [] }) => {
  return (
    <Switch>
      {map(routes, (route, index) => (
        <RouteView key={index} {...route} />
      ))}

      {process.env.REACT_APP_PLATFORM === 'web' && (
        <FirebaseAuthProvider>
          {map(backstageRoutes, (route, index) => (
            <RouteView key={index} {...route} />
          ))}
        </FirebaseAuthProvider>
      )}

      <Redirect to="/" />
    </Switch>
  );
};

AppRoutes.propTypes = {
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      component: PropTypes.func.isRequired,
      exact: PropTypes.bool,
    })
  ),
  backstageRoutes: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      component: PropTypes.func.isRequired,
      exact: PropTypes.bool,
    })
  ),
};
