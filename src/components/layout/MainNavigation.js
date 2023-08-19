import { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../../store/auth-context';

import logo from '../../resources/gogreen.png';
import classes from './MainNavigation.module.css';

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);

  const [one, setOne] = useState(false);
  const [two, setTwo] = useState(false);

  useEffect(() => {
    if (authCtx.role === 'student') {
      setOne(false);
      setTwo(false);
    }
    if (authCtx.role === 'guard') {
      setOne(true);
      setTwo(false);
    }
    if (authCtx.role === 'admin') {
      setTwo(true);
      setOne(false);
    }
  }, [authCtx, authCtx.role]);

  const logoutHandler = () => {
    authCtx.logout();
  };
  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        <img src={logo} />
        Green Rides
      </div>
      <nav className={classes.nav}>
        <ul>
          {authCtx.isLoggedIn && (
            <li>
              <NavLink to="/mainPage" activeClassName={classes.active}>
                Main Page
              </NavLink>
            </li>
          )}
          {authCtx.isLoggedIn && !two && (
            <li>
              <NavLink to="/rent" activeClassName={classes.active}>
                {one ? 'Return' : 'Rent'}
              </NavLink>
            </li>
          )}
          {authCtx.isLoggedIn && two && (
            <li>
              <NavLink to="/admin" activeClassName={classes.active}>
                Admin
              </NavLink>
            </li>
          )}
          {!authCtx.isLoggedIn && (
            <li>
              <NavLink
                to="/auth"
                activeClassName={classes.active}
                onClick={logoutHandler}
              >
                Login
              </NavLink>
            </li>
          )}
          {authCtx.isLoggedIn && two && (
            <li>
              <NavLink to="/cycles" activeClassName={classes.active}>
                Cycles
              </NavLink>
            </li>
          )}
          {authCtx.isLoggedIn && (
            <li>
              <NavLink
                to="/auth"
                activeClassName={classes.active}
                onClick={logoutHandler}
              >
                Logout
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
