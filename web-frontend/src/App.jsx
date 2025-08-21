import { useUser } from "./contexts/authContext";
import { RouteConfig } from "./routes/RouteConfig";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
  const { isAuthReady, isLoggedIn, currentUser } = useUser();

  if (!isAuthReady) return <LoadingSpinner />;

  return <RouteConfig loggedIn={isLoggedIn} user={currentUser} />;
}

export default App;
