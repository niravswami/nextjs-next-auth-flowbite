import AuthLayout from "@/components/layouts/AuthLayout";
import React, { createContext, useState } from "react";
import AuthLayoutContextComp from "./AuthLayoutContextComp";

export const AuthLayoutContext = createContext(null);

const DEFAULT_AUTHLAYOUT_MODAL_PROPRS = {
  isOpen: false,
  msg: "",
};

export default function AuthLayoutContextProvider({ children }) {
  const [authLayoutModalProps, setAuthLayoutModalProps] = useState({
    ...DEFAULT_AUTHLAYOUT_MODAL_PROPRS,
  });
  return (
    <AuthLayoutContext.Provider
      value={{ authLayoutModalProps, setAuthLayoutModalProps }}
    >
      {children}
      {/* {children} */}
    </AuthLayoutContext.Provider>
  );
}
