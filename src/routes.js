import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import App from './containers/App';
import Home from './containers/Home';
import Edit from './containers/Edit';

const delay = 250;
const timeout = 10000;

const routeMap = [
  {
    path: '/',
    component: Home,
    exact: true
  }, {
    path: '/edit',
    component: Edit,
    exact: true
  }
];

export default (
  <BrowserRouter>
    <App>
      <Switch>
        {
          routeMap.map((item, index) => {
            return (
              <Route
                key={index}
                path={item.path}
                exact={item.exact}
                component={item.component}
              />
            );
          })
        }
      </Switch>
    </App>
  </BrowserRouter>
);
