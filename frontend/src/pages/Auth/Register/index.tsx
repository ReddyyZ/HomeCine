import React from "react";
import "./styles.css";
import Logo from "../../../components/Logo";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import colors from "../../../constants/colors";
import { useAuth } from "../../../contexts/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
        className="pl-8 pr-8 pt-[52px] pb-[52px] rounded-sm relative"
      >
        {loading && (
          <div
            className="flex justify-center items-center rounded-sm mb-2"
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
        <p className="text-2xl font-bold mb-2 mt-8">Sign Up</p>
        <p>Create an account to start enjoying HomeCine</p>

        <div className="mt-6 mb-6">
          <div className="w-full mb-4">
            <label htmlFor="email" className="mb-2">
              Name
            </label>
            <Input
              placeholder="Name"
              type="text"
              id="name"
              onChange={(e) => {
                setName(String(e.target.value));
              }}
            />
          </div>
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

        <Button type="submit">Sign Up</Button>

        <p className="text-center mt-6">
          Already have an account?{" "}
          <Link style={{ color: colors.secondary }} to="/">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
