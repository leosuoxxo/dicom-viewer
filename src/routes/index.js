import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';

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

export const AppRoutes = ({ routes = [] }) => {
  return (
    <Switch>
      {routes.map((route, index) => (
        <RouteView key={index} {...route} />
      ))}
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
};
