import React from "react";
import "./styles.css";
import Logo from "../../../components/Logo";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import colors from "../../../constants/colors";
import { useAuth } from "../../../contexts/AuthProvider";
import Alert from "../../../components/Alert";
import LoadingView from "../../../components/LoadingView";

type Result = {
  success: boolean;
  message: string;
};

const LoginAdmin: React.FC = () => {
  const [user, setUser] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [result, setResult] = React.useState({} as Result);
  const [loading, setLoading] = React.useState(false);

  const auth = useAuth();

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading || !user || !password) {
      return;
    }

    setLoading(true);

    const admin = await auth.adminLogin({ user, password });
    if (!admin) {
      setResult({
        success: false,
        message: "An error occurred, please try again later",
      });

      return setLoading(false);
    }

    if (!admin.data.success) {
      setResult({
        success: false,
        message: admin.data.error,
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
          <p>Sign in to continue to dashboard</p>

          <div className="mt-6 mb-6">
            <div className="mb-4 w-full">
              <label htmlFor="user" className="mb-2">
                User
              </label>
              <Input
                placeholder="User"
                type="text"
                id="user"
                value={user}
                onChangeText={setUser}
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
        </form>
      </div>
    </div>
  );
};

export default LoginAdmin;
