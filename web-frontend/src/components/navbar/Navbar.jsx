import { NavLink } from "react-router-dom";
import { useUser } from "../../contexts/authContext";

import logo from "../../assets/goGreen.png";
import classes from "./navbar.module.css";

const Navbar = () => {
  const { login, isLoggedIn, currentUser, logout } = useUser();
  const userRole = currentUser?.role;
  const isSuperAdmin = userRole === "super_admin";
  const isFinanceAdmin = userRole === "finance_admin";

  // Web access allowed for super_admin and finance_admin
  const hasWebAccess = isSuperAdmin || isFinanceAdmin;

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
          {isLoggedIn && isSuperAdmin && (
            <li>
              <NavLink to="/admin" activeClassName={classes.active}>
                Super Admin Dashboard
              </NavLink>
            </li>
          )}
          {isLoggedIn && isFinanceAdmin && (
            <li>
              <NavLink to="/finance-admin" activeClassName={classes.active}>
                Finance Dashboard
              </NavLink>
            </li>
          )}
          {isLoggedIn && hasWebAccess && (
            <li className={classes.userInfo}>
              <span className={`${classes.roleChip} ${classes[userRole]}`}>
                {userRole === "super_admin"
                  ? "Super Admin"
                  : userRole === "finance_admin"
                  ? "Finance Admin"
                  : userRole}
              </span>
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
