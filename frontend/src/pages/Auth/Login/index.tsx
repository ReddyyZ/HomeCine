import React from "react";
import "./styles.css";
import Logo from "../../../components/Logo";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import colors from "../../../constants/colors";
import { useAuth } from "../../../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import Alert from "../../../components/Alert";
import LoadingIndicator from "../../../components/LoadingIndicator";

type Result = {
  success: boolean;
  message: string;
};

const Login: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();
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
    }

    setLoading(false);
    // navigate("/");
  };

  return (
    <div className="max-w-lg">
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
      <form
        onSubmit={login}
        style={{
          backgroundColor: colors.secondaryBg,
        }}
        className="pl-8 pr-8 pt-[52px] pb-[52px] rounded-sm"
      >
        {loading && (
          <div className="flex justify-center items-center mb-2">
            <LoadingIndicator />
          </div>
        )}
        <Logo size="medium" />
        <p className="text-2xl font-bold mb-2 mt-8">Welcome Back</p>
        <p>Sign in to continue to HomeCine</p>

        <div className="mt-6 mb-6">
          <div className="w-full mb-4">
            <label htmlFor="email" className="mb-2">
              Email
            </label>
            <Input
              placeholder="Email"
              type="email"
              id="email"
              onChange={(e) => {
                setEmail(String(e.target.value));
              }}
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
              onChange={(e) => {
                setPassword(String(e.target.value));
              }}
            />
          </div>
        </div>

        <Button type="submit">Sign In</Button>

        <p className="text-center mt-6">
          Don't have an account?{" "}
          <a style={{ color: colors.secondary }}>Sign up</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
