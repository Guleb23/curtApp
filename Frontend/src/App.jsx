
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./components/Login";

import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import ArchivePage from "./components/ArchivePage";

import PrivateRoute from "./router/PrivateRoute";
import AdminRoute from "./router/AdminRoute";
import { useEffect } from "react";

function App() {
  const navigate = useNavigate();

  const {
    isAuthenticated,
    isAdmin,
    isDirector,
    isUser,
    logout,
    user
  } = useAuth();


  const location = useLocation();
  useEffect(() => {
    if (!isAuthenticated) return;

    const onLoginPage = location.pathname === "/login" || location.pathname === "/";

    if (!onLoginPage) return;

    if (isAdmin) {
      navigate("/admin", { replace: true });
    } else if (isDirector || isUser) {
      navigate("/dashboard", { replace: true });
    }
  }, [
    location.pathname,
    isAuthenticated,
    isAdmin,
    isDirector,
    isUser,
    navigate
  ]);


  return (
    <Routes>

      <Route path="/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard onLogout={logout} user={user} />
          </AdminRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard onLogout={logout} user={user} />
          </PrivateRoute>
        }
      />

      <Route
        path="/archive"
        element={
          <PrivateRoute>
            <ArchivePage />
          </PrivateRoute>
        }
      />

      {/* Если не знаем куда — редирект на /login */}
      <Route path="*" element={<Navigate to="/login" />} />

    </Routes>
  );
}

export default function Wrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

