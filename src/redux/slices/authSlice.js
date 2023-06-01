import React from "react";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  errorWhileAuth: {
    status: null,
    errorMsg: "",
  },
};

export const authSlice = createSlice({
  name: "authData",
  initialState,
  reducers: {
    userStateMutate: (state, action) => {
      state.user = action.payload;
    },
    errorWhileAuthMutate: (state, action) => {
      state.errorWhileAuth = { ...state.errorWhileAuth, ...action.payload };
    },
  },
});

export const { userStateMutate, errorWhileAuthMutate } = authSlice.actions;

export default authSlice.reducer;
