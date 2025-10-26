import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const username = localStorage.getItem("username");

  // Eğer kullanıcı giriş yapmadıysa login sayfasına yönlendir
  if (!username) {
    return <Navigate to="/" replace />;
  }

  // Eğer giriş yaptıysa componenti (ör. Dashboard) render et
  return children;
}

export default ProtectedRoute;