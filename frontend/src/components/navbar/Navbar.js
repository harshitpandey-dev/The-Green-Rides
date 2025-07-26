import { NavLink } from "react-router-dom";
import { useUser } from "../../contexts/authContext";

import logo from "../../assets/goGreen.png";
import classes from "./navbar.module.css";

const Navbar = () => {
  const { login, isLoggedIn, currentUser, logout } = useUser();

  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        <img src={logo} alt="Logo" />
        Green Rides
      </div>
      <nav className={classes.nav}>
        <ul>
          {isLoggedIn && (
            <li>
              <NavLink to="/profile" activeClassName={classes.active}>
                Profile
              </NavLink>
            </li>
          )}
          {isLoggedIn && currentUser?.role !== "admin" && (
            <li>
              <NavLink to="/rent" activeClassName={classes.active}>
                {currentUser?.role === "guard" ? "Return" : "Rent"}
              </NavLink>
            </li>
          )}
          {isLoggedIn && currentUser?.role === "admin" && (
            <li>
              <NavLink to="/admin" activeClassName={classes.active}>
                Admin
              </NavLink>
            </li>
          )}
          {!isLoggedIn && (
            <li>
              <NavLink
                to="/auth"
                activeClassName={classes.active}
                onClick={() => login()}
              >
                Login
              </NavLink>
            </li>
          )}
          {isLoggedIn && currentUser?.role === "admin" && (
            <li>
              <NavLink to="/cycles" activeClassName={classes.active}>
                Cycles
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
