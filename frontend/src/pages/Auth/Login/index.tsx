import React from "react";
import "./styles.css";
import Logo from "../../../components/Logo";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import colors from "../../../constants/colors";

// import { Container } from './styles';

const Login: React.FC = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div
        style={{
          backgroundColor: colors.secondaryBg,
        }}
        className="pl-8 pr-8 pt-[52px] pb-[52px] rounded-sm"
      >
        <Logo size="medium" />
        <p className="text-2xl font-bold mb-2 mt-8">Welcome Back</p>
        <p>Sign in to continue to HomeCine</p>

        <div className="mt-6 mb-6">
          <div className="w-96 mb-4">
            <label htmlFor="email" className="mb-2">
              Email
            </label>
            <Input placeholder="Email" type="email" id="email" />
          </div>
          <div className="w-96">
            <label htmlFor="password" className="mb-2">
              Password
            </label>
            <Input placeholder="Password" type="password" id="password" />
          </div>
        </div>

        <Button>Sign In</Button>

        <p className="text-center mt-6">
          Don't have an account?{" "}
          <a style={{ color: colors.secondary }}>Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
