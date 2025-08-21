import React, { Suspense, Fragment } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Signup from "../screens/auth/Signup";
import DashboardScreen from "../screens/admin/DashboardScreen";
import StudentsScreen from "../screens/admin/StudentsScreen";
import GuardsScreen from "../screens/admin/GuardsScreen";
import CyclesScreen from "../screens/admin/CyclesScreen";
import FinanceAdminsScreen from "../screens/admin/FinanceAdminsScreen";
import FinanceAdminScreen from "../screens/financeAdmin/FinanceAdminScreen";
import AppLayout from "../components/layout/AppLayout";
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
    <AppLayout>
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
            exact
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
            <DashboardScreen />
          </ProtectedRoute>

          <ProtectedRoute
            path="/admin/students"
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
            <StudentsScreen />
          </ProtectedRoute>

          <ProtectedRoute
            path="/admin/guards"
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
            <GuardsScreen />
          </ProtectedRoute>

          <ProtectedRoute
            path="/admin/cycles"
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
            <CyclesScreen />
          </ProtectedRoute>

          <ProtectedRoute
            path="/admin/finance-admins"
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
            <FinanceAdminsScreen />
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
    </AppLayout>
  );
};
