import React, { useState, useEffect, useCallback } from "react";
import jwt_decode from "jwt-decode";

export const AuthContext = React.createContext({
  token: null,
  currentUser: null,
  isLoggedIn: false,
  isAuthReady: false,
  login: (user, token) => {},
  logout: () => {},
});

const calculateRemainingTime = (exp) => {
  const currentTime = new Date().getTime();
  const expirationTime = exp * 1000; // `exp` is in seconds
  return expirationTime - currentTime;
};

const retrieveStoredAuth = () => {
  const storedToken = localStorage.getItem("GR_TOKEN");
  const storedUser = localStorage.getItem("GR_USER");

  if (!storedToken || !storedUser) return null;

  try {
    const decodedToken = jwt_decode(storedToken);
    const remainingTime = calculateRemainingTime(decodedToken.exp);

    if (remainingTime <= 0) {
      localStorage.removeItem("GR_TOKEN");
      localStorage.removeItem("GR_USER");
      return null;
    }

    return {
      token: storedToken,
      user: JSON.parse(storedUser),
      remainingTime,
    };
  } catch (err) {
    // Invalid token
    localStorage.removeItem("GR_TOKEN");
    localStorage.removeItem("GR_USER");
    return null;
  }
};

let logoutTimer;

export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const logout = useCallback(() => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem("GR_TOKEN");
    localStorage.removeItem("GR_USER");
    if (logoutTimer) clearTimeout(logoutTimer);
  }, []);

  const login = (user, token) => {
    setToken(token);
    setCurrentUser(user);
    localStorage.setItem("GR_TOKEN", token);
    localStorage.setItem("GR_USER", JSON.stringify(user));

    const decodedToken = jwt_decode(token);
    const remainingTime = calculateRemainingTime(decodedToken.exp);

    logoutTimer = setTimeout(logout, remainingTime);
  };

  useEffect(() => {
    const storedAuth = retrieveStoredAuth();

    if (storedAuth) {
      setToken(storedAuth.token);
      setCurrentUser(storedAuth.user);
      logoutTimer = setTimeout(logout, storedAuth.remainingTime);
    }

    setIsAuthReady(true);
  }, [logout]);

  const contextValue = {
    token,
    currentUser,
    isLoggedIn: !!token,
    isAuthReady,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
