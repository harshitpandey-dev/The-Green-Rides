import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { AuthContextProvider } from "./contexts/authContext";

import "./index.css";
import App from "./App";

import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </BrowserRouter>
  </AuthContextProvider>
);
