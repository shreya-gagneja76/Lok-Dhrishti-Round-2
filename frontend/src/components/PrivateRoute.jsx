import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PrivateRoute({ children, adminOnly = false }) {
  const { user, isAdmin } = useContext(AuthContext);

  console.log("PrivateRoute user:", user);
  console.log("PrivateRoute isAdmin:", isAdmin);

  if (!user) {
    console.log("Redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    console.log("Redirecting non-admin user to complaints");
    return <Navigate to="/complaints" replace />;
  }

  return children;
}
