import React from "react";
import colors from "../../constants/colors";
import "./styles.css";
import { JSX } from "react/jsx-runtime";

const CinemaCamera = (
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xml:space="preserve"
    version="1.1"
    viewBox="0 0 752.72 649.29"
    x="0px"
    y="0px"
    fill-rule="evenodd"
    clip-rule="evenodd"
  >
    <defs></defs>
    <g>
      <path d="M25 274.69l46.43 0c-14.09,-19.64 -22.39,-43.65 -22.39,-69.53 0,-65.87 53.66,-119.53 119.53,-119.53 29.29,0 56.14,10.58 76.94,28.14 21.14,-67.22 83.77,-113.77 154.93,-113.77 89.51,0 162.34,72.83 162.34,162.34 0,43.53 -17.23,83.14 -45.25,112.35l46.09 0c13.8,0 25,11.2 25,25l0 40.96 126.45 -62.54c16.4,-9.64 37.64,2.09 37.64,21.57l0 324.6c-0.29,18.21 -19.18,30.68 -36.04,22.36l-128.05 -63.32 0 40.96c0,13.8 -11.2,25 -25,25l-538.63 0c-13.8,0 -25,-11.2 -25,-25l0 -324.59c0,-13.8 11.2,-25 25,-25zm310.36 87.5c26.62,0 26.62,40.49 0,40.49l-20.97 0c-26.62,0 -26.62,-40.49 0,-40.49l20.97 0zm-250.61 40.49c-26.63,0 -26.64,-40.49 0,-40.49l162.3 0c26.62,0 26.62,40.49 0,40.49l-162.3 0zm188.4 -139.69c-2.25,4.05 -4.72,7.95 -7.41,11.7l17.61 0c-3.58,-3.73 -6.98,-7.64 -10.2,-11.7zm127.29 11.7c62.17,0 112.34,-50.18 112.34,-112.35 0,-62.16 -50.18,-112.34 -112.34,-112.34 -62.17,0 -112.35,50.17 -112.35,112.34 0,62.18 50.17,112.35 112.35,112.35zm-231.87 0c38.51,0 69.52,-31.03 69.52,-69.53 0,-38.5 -31.01,-69.53 -69.52,-69.53 -38.52,0 -69.53,31.01 -69.53,69.53 0,38.52 31.01,69.53 69.53,69.53zm420.06 121.6l0 131.39 114.09 56.42 0 -244.24 -114.09 56.43zm-50 -71.6c-162.87,0 -325.75,0 -488.63,0l0 274.59 488.63 0c0,-91.53 0,-183.06 0,-274.59z"></path>
    </g>
  </svg>
);
type LogoProps = {
  size?: "large" | "medium" | "small";
};

export default function Logo({ size }: LogoProps) {
  return (
    <h1
      id="logo-container"
      style={{
        fontSize:
          size === "large"
            ? "48px"
            : size === "medium"
              ? "32px"
              : size === "small"
                ? "30px"
                : "32px",
      }}
    >
      Home
      <div className="flex flex-wrap justify-center">
        <div className="p-1.5">
          <CinemaCamera
            fill={colors.primary}
            height={
              size === "large"
                ? "50"
                : size === "medium"
                  ? "40"
                  : size === "small"
                    ? "30"
                    : "40"
            }
          />
        </div>
        Cine
      </div>
    </h1>
  );
}
