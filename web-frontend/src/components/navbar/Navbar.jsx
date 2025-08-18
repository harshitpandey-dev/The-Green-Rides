import { NavLink } from "react-router-dom";
import { useUser } from "../../contexts/authContext";

import logo from "../../assets/goGreen.png";
import classes from "./navbar.module.css";

const Navbar = () => {
  const { login, isLoggedIn, currentUser, logout } = useUser();
  const isAdmin = currentUser?.role === "admin";
  const isFinance = currentUser?.role === "finance";
  const hasWebAccess = isAdmin || isFinance;

  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        <img src={logo} alt="Logo" />
        Green Rides
      </div>
      <nav className={classes.nav}>
        <ul>
          {isLoggedIn && hasWebAccess && (
            <li>
              <NavLink to="/profile" activeClassName={classes.active}>
                Profile
              </NavLink>
            </li>
          )}
          {isLoggedIn && isAdmin && (
            <li>
              <NavLink to="/admin" activeClassName={classes.active}>
                Admin Dashboard
              </NavLink>
            </li>
          )}
          {isLoggedIn && isFinance && (
            <li>
              <NavLink to="/finance" activeClassName={classes.active}>
                Finance Dashboard
              </NavLink>
            </li>
          )}
          {isLoggedIn && hasWebAccess && (
            <li>
              <NavLink to="/cycles" activeClassName={classes.active}>
                Manage Cycles
              </NavLink>
            </li>
          )}
          {!isLoggedIn && (
            <li>
              <NavLink to="/auth" activeClassName={classes.active}>
                Login
              </NavLink>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <NavLink
                to="/auth"
                activeClassName={classes.active}
                onClick={() => logout()}
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

export default Navbar;
