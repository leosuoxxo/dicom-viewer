import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { map } from 'lodash';
import { FirebaseAuthProvider } from '../services/firebaseAuthService';
import { AuthenticationCodeProvider } from '../services/authenticationCode';
import { CornerstoneServiceProvider } from '../services/cornerstoneService';
import { ToolManageServiceProvider } from '../services/toolManageService';

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
      <AuthenticationCodeProvider>
        <CornerstoneServiceProvider>
          <ToolManageServiceProvider>
            {map(routes, (route, index) => (
              <RouteView key={index} {...route} />
            ))}
          </ToolManageServiceProvider>
        </CornerstoneServiceProvider>
      </AuthenticationCodeProvider>
      <FirebaseAuthProvider>
        {map(backstageRoutes, (route, index) => (
          <RouteView key={index} {...route} />
        ))}
      </FirebaseAuthProvider>
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
