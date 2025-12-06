import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth() || {};
  if (!user) {
    toast.error("You must log in first");
    return <Navigate to="/login" replace />;
  }
  return children;
}
