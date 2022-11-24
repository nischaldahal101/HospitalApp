import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AdminContext from '../../context/Admin/AdminContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuth, isLoading } = useContext(AdminContext);
  const token = localStorage.getItem('token');

  return (
    <Route
      {...rest}
      render={(props) =>
        (isAuth === null && isLoading === null) || token === null ? (
          <Redirect to='/' />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PrivateRoute;
