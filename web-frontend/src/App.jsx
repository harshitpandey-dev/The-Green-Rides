import { useUser } from "./contexts/authContext";
import { ToastProvider } from "./contexts/ToastContext";
import { ConfirmationProvider } from "./contexts/ConfirmationContext";
import { RouteConfig } from "./routes/RouteConfig";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
  const { isAuthReady, isLoggedIn, currentUser } = useUser();

  if (!isAuthReady) return <LoadingSpinner />;

  return (
    <ToastProvider>
      <ConfirmationProvider>
        <RouteConfig loggedIn={isLoggedIn} user={currentUser} />
      </ConfirmationProvider>
    </ToastProvider>
  );
}

export default App;
