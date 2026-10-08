import { BrowserRouter, Routes, Route } from "react-router";
import Home from "../pages/Home.tsx";
import Login from "../pages/Login.tsx";
import { AuthProvider } from "../context/AuthContext.tsx";
import Dashboard from "../pages/Dashboard.tsx";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<h1>404 - Not Found</h1>} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;