import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import { useAuth } from "./contexts/AuthProvider";
import Home from "./pages/Home";
import { jwtDecode } from "jwt-decode";
import MoviePage from "./pages/Movie";
import Watch from "./pages/Watch";
import AdminHome from "./pages/Admin/Home";
import Admin from "./pages/Admin";
import AdminMovies from "./pages/Admin/Movies";

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
      <Route path="/movie/:movieId" element={<MoviePage />} />
      <Route path="/movie/:movieId/watch" element={<Watch />} />
      <Route
        path="/movie/:movieId/episode/:episodeId/watch"
        element={<Watch />}
      />
      <Route path="/admin" element={<Admin />}>
        <Route path="" element={<AdminHome />} />
        <Route path="movies" element={<AdminMovies />} />
      </Route>
      <Route path="*" element={<h1>Not Found</h1>} />
    </Routes>
  );
}

export default App;
