import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { AuthContextProvider } from "./store/auth-context";

import "./index.css";
import App from "./App";

import { GoogleOAuthProvider } from "@react-oauth/google";

<App />;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <BrowserRouter>
      <GoogleOAuthProvider clientId="634682110726-38isdrk71r1ga78ho1magulvr2vpivki.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </BrowserRouter>
  </AuthContextProvider>
);
