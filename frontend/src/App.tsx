import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import { useAuth } from "./contexts/AuthProvider";
import Home from "./pages/Home";
import { jwtDecode } from "jwt-decode";

function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

function App() {
  const auth = useAuth();
  const checkUser = () => {
    if (!auth.user) return false;
    const jwt = jwtDecode(auth.user);

    if (!jwt.exp) return false;

    if (jwt.exp * 1000 < Date.now()) {
      auth.logout();
      return false;
    } else {
      return true;
    }
  };

  return !checkUser() ? (
    <AuthRoutes />
  ) : (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
