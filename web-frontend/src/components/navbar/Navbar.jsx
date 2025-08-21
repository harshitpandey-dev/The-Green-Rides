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

      {/* Show minimal navigation for logged in users - sidebar will handle main navigation */}
      <nav className={classes.nav}>
        <ul>
          {!isLoggedIn && (
            <>
              <li>
                <NavLink to="/auth" activeClassName={classes.active}>
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink to="/signup" activeClassName={classes.active}>
                  Sign Up
                </NavLink>
              </li>
            </>
          )}

          {isLoggedIn && !hasWebAccess && (
            <li className={classes.userInfo}>
              <span className={`${classes.roleChip} ${classes[userRole]}`}>
                {userRole === "student" ? "Student" : "Guard"}
              </span>
              <span className={classes.userName}>{currentUser?.name}</span>
              <button onClick={logout} className={classes.logoutBtn}>
                Logout
              </button>
            </li>
          )}

          {/* For web users, show minimal info - sidebar handles navigation */}
          {isLoggedIn && hasWebAccess && (
            <li className={classes.userInfo}>
              <span className={classes.welcomeText}>
                Welcome, {currentUser?.name}
              </span>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
