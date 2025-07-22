import React, { useContext } from "react";
import { AuthContext } from "./contexts/authContext";
import { RouteConfig } from "./routes/RouteConfig";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
  const { isAuthReady, isLoggedIn, currentUser } = useContext(AuthContext);

  if (!isAuthReady) return <LoadingSpinner />;

  return (
    <RouteConfig
      loggedIn={isLoggedIn}
      isAdmin={currentUser?.role === "admin"}
    />
  );
}

export default App;
