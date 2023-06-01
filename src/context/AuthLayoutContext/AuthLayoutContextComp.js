import AuthLayout from "@/components/layouts/AuthLayout";
import React from "react";
import AuthLayoutContextProvider from "./AuthLayoutContextProvider";

export default function AuthLayoutContextComp({ children }) {
  return (
    <AuthLayoutContextProvider>
      {/* <AuthLayout> */}
      {children}
      {/* </AuthLayout> */}
    </AuthLayoutContextProvider>
  );
}
