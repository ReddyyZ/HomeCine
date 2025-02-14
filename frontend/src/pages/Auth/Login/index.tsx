import React from "react";
import "./styles.css";
import Logo from "../../../components/Logo";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import colors from "../../../constants/colors";
import { useAuth } from "../../../contexts/AuthProvider";
import { Link } from "react-router-dom";
import Alert from "../../../components/Alert";
import LoadingView from "../../../components/LoadingView";

type Result = {
  success: boolean;
  message: string;
};

const Login: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [result, setResult] = React.useState({} as Result);
  const [loading, setLoading] = React.useState(false);

  const auth = useAuth();

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading || !email || !password) {
      return;
    }

    setLoading(true);

    const user = await auth.login({ email, password });
    if (!user) {
      setResult({
        success: false,
        message: "An error occurred, please try again later",
      });

      return setLoading(false);
    }

    if (!user.data.success) {
      setResult({
        success: false,
        message: user.data.error,
      });
    } else {
      setResult({
        success: true,
        message: "Logged in successfully, redirecting...",
      });
      window.location.reload();
    }

    setLoading(false);
  };

  return (
    <div className="loginDiv">
      <div className="relative w-96 max-w-lg">
        {result.message && (
          <Alert
            type={result.success ? "success" : "error"}
            style={{
              marginBottom: 8,
            }}
          >
            {result.message}
          </Alert>
        )}
        {loading && <LoadingView />}
        <form
          onSubmit={login}
          style={{
            backgroundColor: colors.secondaryBg,
          }}
          className="rounded-sm pt-[52px] pr-8 pb-[52px] pl-8"
        >
          <input type="submit" hidden />
          <Logo size="medium" />
          <p className="mt-8 mb-2 text-2xl font-bold">Welcome Back</p>
          <p>Sign in to continue to HomeCine</p>

          <div className="mt-6 mb-6">
            <div className="mb-4 w-full">
              <label htmlFor="email" className="mb-2">
                Email
              </label>
              <Input
                placeholder="Email"
                type="email"
                id="email"
                value={email}
                onChangeText={setEmail}
              />
            </div>
            <div className="w-full">
              <label htmlFor="password" className="mb-2">
                Password
              </label>
              <Input
                placeholder="Password"
                type="password"
                id="password"
                value={password}
                onChangeText={setPassword}
              />
            </div>
          </div>

          <Button type="submit">Sign In</Button>

          <p className="mt-6 text-center">
            Don't have an account?{" "}
            <Link style={{ color: colors.secondary }} to="/register">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
