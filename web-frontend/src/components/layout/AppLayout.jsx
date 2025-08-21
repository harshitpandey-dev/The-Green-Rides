import React from "react";
import { useUser } from "../../contexts/authContext";
import Sidebar from "./Sidebar";
import "./AppLayout.css";

const AppLayout = ({ children }) => {
  const { isLoggedIn, currentUser } = useUser();
  const userRole = currentUser?.role;
  const hasWebAccess =
    userRole === "super_admin" || userRole === "finance_admin";
  const showSidebar = isLoggedIn && hasWebAccess;

  return (
    <div className="app-layout">
      <div className="app-body">
        {showSidebar && <Sidebar />}
        <main
          className={`app-main ${showSidebar ? "with-sidebar" : "full-width"}`}
        >
          <div className="app-content">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
