import React, { Suspense, Fragment } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Signup from "./screens/auth/Signup";
import AdminScreen from "./screens/admin/AdminScreen";
import Cycles from "./screens/cycles/Cycles";
import Navbar from "./components/navbar/Navbar";
import LoadingSpinner from "./components/common/LoadingSpinner";

export const RouteConfig = ({ loggedIn, isAdmin }) => {
  const NotFound = React.lazy(() => import("./screens/notFound/NotFound"));
  const ProfilePage = React.lazy(() => import("./screens/profile/UserProfile"));
  const LoginPage = React.lazy(() => import("./screens/auth/Login"));
  const Rent = React.lazy(() => import("./screens/rent/Rent"));

  return (
    <Fragment>
      <Navbar />
      <main style={{ margin: "3rem auto", width: "90%", maxWidth: "40rem" }}>
        <Suspense fallback={<LoadingSpinner />}>
          <Switch>
            <Route path="/" exact>
              {loggedIn && <Redirect to="/mainPage" />}
              {!loggedIn && <Redirect to="/auth" />}
            </Route>
            <Route path="/signup">
              {loggedIn && <Redirect to="/mainPage" />}
              {!loggedIn && <Signup />}
            </Route>
            <Route path="/auth">
              {loggedIn && <Redirect to="/mainPage" />}
              {!loggedIn && <LoginPage />}
            </Route>
            <Route path="/mainPage">
              {loggedIn && <ProfilePage />}
              {!loggedIn && <Redirect to="/auth" />}
            </Route>
            <Route path="/rent">
              {loggedIn && <Rent />}
              {!loggedIn && <Redirect to="/auth" />}
            </Route>
            <Route path="/admin">
              {loggedIn && isAdmin && <AdminScreen />}
              {loggedIn && !isAdmin && <Redirect to="/auth" />}
              {!loggedIn && !isAdmin && <Redirect to="/auth" />}
            </Route>
            <Route path="/cycles">
              <Cycles />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </Suspense>
      </main>
    </Fragment>
  );
};
