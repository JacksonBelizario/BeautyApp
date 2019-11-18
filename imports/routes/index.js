import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Redirect, Route, Switch } from 'react-router-dom';
import {Typography} from '@material-ui/core';
import Sample from '../ui/Sample.jsx';
import Login from '../ui/Login.jsx';
import Calendar from '../ui/Scheduler/Calendar.jsx';
import UserProfile from '../ui/User/Profile.jsx';
import Services from '../ui/Service/Services.jsx';
import Employees from '../ui/Employee/Employees.jsx';
import Customers from '../ui/Customer/Customers.jsx';

export const RouterPaths = {
  ROOT: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  USER_PROFILE: '/profile',
  SERVICES: '/services',
  PRODUCTS: '/products',
  EMPLOYEES: '/employees',
  CUSTOMERS: '/customers',
};

const PrivateRoute = ({ component: Component, path, breadcrumb, ...rest }) => (
  <Route
    {...rest}
    render={({ location, ...props }) =>
      Meteor.userId() ? (<div>
        {breadcrumb ? <Typography variant="h5" color="primary">{breadcrumb}</Typography> : ''}
          <Component {...props} />
        </div>) : (
        <Redirect
          to={{
            pathname: RouterPaths.LOGIN,
            state: { redirect: location.pathname },
          }}
        />
      )
    }
  />
);

export const Routes = () => (
  <Switch>

      <Route path={RouterPaths.LOGIN} component={Login} />

      <PrivateRoute exact path={RouterPaths.ROOT} component={Calendar} />

      <PrivateRoute path={RouterPaths.USER_PROFILE} component={UserProfile} />

      <PrivateRoute path={RouterPaths.EMPLOYEES} component={Employees} breadcrumb="Funcionários" />

      <PrivateRoute path={RouterPaths.CUSTOMERS} component={Customers} breadcrumb="Clientes" />

      <PrivateRoute path={RouterPaths.SERVICES} component={Services} breadcrumb="Serviços" />

      <PrivateRoute path={RouterPaths.PRODUCTS} component={Sample} breadcrumb="Produtos" />
  </Switch>
);
