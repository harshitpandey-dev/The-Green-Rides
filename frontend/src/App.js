import React, { useContext, useState, useEffect } from "react";
import AuthContext from "./contexts/authContext";
import { loginUser } from "./services/auth.service";
import { RouteConfig } from "./routes/RouteConfig";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
  const authCtx = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authCtx.isLoggedIn) {
      return;
    }

    setIsLoading(true);
    loginUser({
      email: authCtx.email,
      password: authCtx.password,
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          authCtx.logout();
          return res.json().then((data) => {
            let errorMessage = "Authentication Failed";
            if (data && data.error && data.error.message) {
              setIsLoading(false);
              errorMessage = data.error.message;
            }
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        const expirationTime = new Date(new Date().getTime() + +36000000);
        authCtx.login(
          data,
          authCtx.password,
          data.token,
          data._id,
          data.role,
          data.cycleId,
          expirationTime.toISOString()
        );
      })
      .catch((err) => {
        alert(err.message);
      });
  }, [authCtx]);

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <RouteConfig
          loggedIn={authCtx.isLoggedIn}
          isAdmin={authCtx.role === "admin"}
        />
      )}
    </>
  );
}

export default App;
