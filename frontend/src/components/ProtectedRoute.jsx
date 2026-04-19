import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import {
  getCurrentUser,
  clearCurrentUser,
  refreshCurrentUserSession,
} from "../utils/getCurrentUser";

const ProtectedRoute = ({ children, adminOnly = false, userOnly = false }) => {
  const [checking, setChecking] = useState(true);
  const [redirectTo, setRedirectTo] = useState(null);

  useEffect(() => {
    const validateUser = async () => {
      const user = getCurrentUser();

      if (!user || !user.token) {
        setRedirectTo("/");
        setChecking(false);
        return;
      }

      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/auth/session-info",
        );

        if (
          !data?.serverSessionId ||
          data.serverSessionId !== user.serverSessionId
        ) {
          clearCurrentUser();
          setRedirectTo("/");
          setChecking(false);
          return;
        }

        refreshCurrentUserSession();

        if (adminOnly && user.role !== "admin") {
          setRedirectTo("/dashboard");
          setChecking(false);
          return;
        }

        if (userOnly && user.role === "admin") {
          setRedirectTo("/admin");
          setChecking(false);
          return;
        }

        setRedirectTo(null);
      } catch (error) {
        clearCurrentUser();
        setRedirectTo("/");
      } finally {
        setChecking(false);
      }
    };

    validateUser();
  }, [adminOnly, userOnly]);

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-900 flex items-center justify-center text-white text-lg font-semibold">
        Loading...
      </div>
    );
  }

  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;
