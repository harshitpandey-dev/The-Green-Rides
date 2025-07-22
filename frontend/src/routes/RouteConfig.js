import React, { Suspense, Fragment } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Signup from "../screens/auth/Signup";
import AdminScreen from "../screens/admin/AdminScreen";
import Cycles from "../screens/cycles/Cycles";
import Navbar from "../components/navbar/Navbar";
import LoadingSpinner from "../components/common/LoadingSpinner";

export const RouteConfig = ({ loggedIn, isAdmin }) => {
  const NotFound = React.lazy(() => import("../screens/notFound/NotFound"));
  const ProfilePage = React.lazy(() =>
    import("../screens/profile/UserProfile")
  );
  const LoginPage = React.lazy(() => import("../screens/auth/Login"));
  const Rent = React.lazy(() => import("../screens/rent/Rent"));

  const ProtectedRoute = ({ condition, redirectTo, children, ...rest }) => (
    <Route
      {...rest}
      render={() => (condition ? children : <Redirect to={redirectTo} />)}
    />
  );

  return (
    <Fragment>
      <Navbar />
      <main style={{ margin: "3rem auto", width: "90%", maxWidth: "40rem" }}>
        <Suspense fallback={<LoadingSpinner />}>
          <Switch>
            <Route exact path="/">
              <Redirect to={loggedIn ? "/profile" : "/auth"} />
            </Route>

            <ProtectedRoute
              path="/signup"
              condition={!loggedIn}
              redirectTo="/profile"
            >
              <Signup />
            </ProtectedRoute>

            <ProtectedRoute
              path="/auth"
              condition={!loggedIn}
              redirectTo="/profile"
            >
              <LoginPage />
            </ProtectedRoute>

            <ProtectedRoute
              path="/profile"
              condition={loggedIn}
              redirectTo="/auth"
            >
              <ProfilePage />
            </ProtectedRoute>

            <ProtectedRoute
              path="/rent"
              condition={loggedIn}
              redirectTo="/auth"
            >
              <Rent />
            </ProtectedRoute>

            <ProtectedRoute
              path="/admin"
              condition={loggedIn && isAdmin}
              redirectTo="/auth"
            >
              <AdminScreen />
            </ProtectedRoute>

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
