import React, { Suspense, Fragment } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Signup from "../screens/auth/Signup";
import AdminScreen from "../screens/admin/AdminScreen";
import FinanceScreen from "../screens/finance/FinanceScreen";
import CycleListScreen from "../screens/cycles/CycleListScreen";
import Navbar from "../components/navbar/Navbar";
import LoadingSpinner from "../components/common/LoadingSpinner";

export const RouteConfig = ({ loggedIn, user }) => {
  const isAdmin = user?.role === "admin";
  const isFinance = user?.role === "finance";
  const hasWebAccess = isAdmin || isFinance;
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
      <main
        style={{
          margin: "2rem auto",
          width: "95%",
          maxWidth: "1200px",
          padding: "0 1rem",
        }}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <Switch>
            <Route exact path="/">
              <Redirect
                to={
                  loggedIn
                    ? hasWebAccess
                      ? "/admin"
                      : "/access-denied"
                    : "/auth"
                }
              />
            </Route>

            {/* Access denied route for guard/student users */}
            <Route path="/access-denied">
              {loggedIn && !hasWebAccess ? (
                <div style={{ textAlign: "center", padding: "2rem" }}>
                  <h2>Web Access Not Available</h2>
                  <p>Students and Guards should use the mobile application.</p>
                  <p>Please download the mobile app to access your features.</p>
                </div>
              ) : (
                <Redirect to="/" />
              )}
            </Route>

            <ProtectedRoute path="/signup" condition={!loggedIn} redirectTo="/">
              <Signup />
            </ProtectedRoute>

            <ProtectedRoute path="/auth" condition={!loggedIn} redirectTo="/">
              <LoginPage />
            </ProtectedRoute>

            <ProtectedRoute
              path="/profile"
              condition={loggedIn && hasWebAccess}
              redirectTo={loggedIn ? "/access-denied" : "/auth"}
            >
              <ProfilePage />
            </ProtectedRoute>

            <ProtectedRoute
              path="/admin"
              condition={loggedIn && isAdmin}
              redirectTo={
                loggedIn
                  ? hasWebAccess
                    ? "/profile"
                    : "/access-denied"
                  : "/auth"
              }
            >
              <AdminScreen />
            </ProtectedRoute>

            <ProtectedRoute
              path="/finance"
              condition={loggedIn && isFinance}
              redirectTo={
                loggedIn
                  ? hasWebAccess
                    ? "/profile"
                    : "/access-denied"
                  : "/auth"
              }
            >
              <FinanceScreen />
            </ProtectedRoute>

            <ProtectedRoute
              path="/cycles"
              condition={loggedIn && hasWebAccess}
              redirectTo={loggedIn ? "/access-denied" : "/auth"}
            >
              <CycleListScreen />
            </ProtectedRoute>

            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </Suspense>
      </main>
    </Fragment>
  );
};
