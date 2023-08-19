import React, { useContext, Suspense, useState, useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
// import NotFound from './pages/NotFound';
// import ProfilePage from './pages/ProfilePage';
// import AuthPage from './/pages/AuthPage';
// import Rent from './pages/Rent';
import Signup from './pages/Signup';

import Layout from './components/layout/Layout';
import LoadingSpinner from './components/UI/LoadingSpinner';
import AdminPage from './pages/AdminPage';
import Cycles from './pages/Cycles';
import AuthContext from './store/auth-context';

function App() {
  const NotFound = React.lazy(() => import('./pages/NotFound'));
  const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
  const AuthPage = React.lazy(() => import('./pages/AuthPage'));
  const Rent = React.lazy(() => import('./pages/Rent'));
  // const Signup = React.lazy(() => import('./pages/Signup'));

  const authCtx = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const loggedIn = authCtx.isLoggedIn;

  useEffect(() => {
    if (loggedIn) {
      setIsLoading(true);
      fetch('https://cycle-api.azurewebsites.net/users/login', {
        method: 'POST',
        body: JSON.stringify({
          email: authCtx.email,
          password: authCtx.password,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          setIsLoading(false);
          if (res.ok) {
            return res.json();
          } else {
            authCtx.logout();
            return res.json().then((data) => {
              let errorMessage = 'Authentication Failed';
              if (data && data.error && data.error.message) {
                setIsLoading(false);
                errorMessage = data.error.message;
              }
              throw new Error(errorMessage);
            });
          }
        })
        .then((data) => {
          const experationTime = new Date(new Date().getTime() + +36000000);
          authCtx.login(
            data,
            authCtx.password,
            data.token,
            data._id,
            data.role,
            data.cycleid,
            experationTime.toISOString()
          );
        })
        .catch((err) => {
          alert(err.message);
        });
    }
  }, [loggedIn]);

  useEffect(() => {
    if (authCtx.role === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [isAdmin, authCtx.role, authCtx]);

  if (isLoading) {
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Layout>
      <Suspense
        fallback={
          <div className="centered">
            <LoadingSpinner />
          </div>
        }
      >
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
            {!loggedIn && <AuthPage />}
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
            {loggedIn && isAdmin && <AdminPage />}
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
    </Layout>
  );
}

export default App;
