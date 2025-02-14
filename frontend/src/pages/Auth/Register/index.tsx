import React from "react";
import "./styles.css";
import Logo from "../../../components/Logo";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import colors from "../../../constants/colors";
import { useAuth } from "../../../contexts/AuthProvider";
import { Link } from "react-router-dom";
import Alert from "../../../components/Alert";
import LoadingIndicator from "../../../components/LoadingIndicator";

type Result = {
  success: boolean;
  message: string;
};

const Register: React.FC = () => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [result, setResult] = React.useState({} as Result);
  const [loading, setLoading] = React.useState(false);

  const auth = useAuth();

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading || !email || !password || !name) {
      return;
    }

    setLoading(true);

    const user = await auth.register({ name, email, password });
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
        message: "Email already in use",
      });
    } else {
      setResult({
        success: true,
        message: "Account created successfully, redirecting...",
      });

      window.location.href = "/";
    }

    setLoading(false);
  };

  return (
    <div className="loginDiv">
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
          className="relative rounded-sm pt-[52px] pr-8 pb-[52px] pl-8"
        >
          <input type="submit" hidden />
          {loading && (
            <div
              className="appear-animation mb-2 flex items-center justify-center rounded-sm"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                backdropFilter: "blur(5px)",
                width: "100%",
                height: "100%",
              }}
            >
              <LoadingIndicator />
            </div>
          )}
          <Logo size="medium" />
          <p className="mt-8 mb-2 text-2xl font-bold">Sign Up</p>
          <p>Create an account to start enjoying HomeCine</p>

          <div className="mt-6 mb-6">
            <div className="mb-4 w-full">
              <label htmlFor="email" className="mb-2">
                Name
              </label>
              <Input
                placeholder="Name"
                type="text"
                id="name"
                value={name}
                onChangeText={setName}
              />
            </div>
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

          <Button type="submit">Sign Up</Button>

          <p className="mt-6 text-center">
            Already have an account?{" "}
            <Link style={{ color: colors.secondary }} to="/">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
