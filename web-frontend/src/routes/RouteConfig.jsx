import React, { Suspense, Fragment } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Signup from "../screens/auth/Signup";
import AdminScreen from "../screens/admin/AdminScreen";
import FinanceAdminScreen from "../screens/admin/FinanceAdminScreen";
import Navbar from "../components/navbar/Navbar";
import LoadingSpinner from "../components/common/LoadingSpinner";

export const RouteConfig = ({ loggedIn, user }) => {
  const userRole = user?.role;
  const isSuperAdmin = userRole === "super_admin";
  const isFinanceAdmin = userRole === "finance_admin";
  const isGuard = userRole === "guard";
  const isStudent = userRole === "student";

  // Web access allowed for super_admin and finance_admin
  const hasWebAccess = isSuperAdmin || isFinanceAdmin;

  const NotFound = React.lazy(() => import("../screens/notFound/NotFound"));
  const ProfilePage = React.lazy(() =>
    import("../screens/profile/UserProfile")
  );
  const LoginPage = React.lazy(() => import("../screens/auth/Login"));

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
                      ? isSuperAdmin
                        ? "/admin"
                        : "/finance-admin"
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
                  <p>
                    {isStudent && "Students should use the mobile application."}
                    {isGuard && "Guards should use the mobile application."}
                  </p>
                  <p>Please download the mobile app to access your features.</p>
                  <div style={{ marginTop: "2rem" }}>
                    <p>
                      <strong>Your Role:</strong> {userRole}
                    </p>
                    <p>
                      <strong>Access Level:</strong> Mobile Only
                    </p>
                  </div>
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

            {/* Super Admin Routes */}
            <ProtectedRoute
              path="/admin"
              condition={loggedIn && isSuperAdmin}
              redirectTo={
                loggedIn
                  ? hasWebAccess
                    ? isFinanceAdmin
                      ? "/finance-admin"
                      : "/access-denied"
                    : "/access-denied"
                  : "/auth"
              }
            >
              <AdminScreen />
            </ProtectedRoute>

            {/* Finance Admin Routes */}
            <ProtectedRoute
              path="/finance-admin"
              condition={loggedIn && isFinanceAdmin}
              redirectTo={
                loggedIn
                  ? hasWebAccess
                    ? isSuperAdmin
                      ? "/admin"
                      : "/access-denied"
                    : "/access-denied"
                  : "/auth"
              }
            >
              <FinanceAdminScreen />
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
