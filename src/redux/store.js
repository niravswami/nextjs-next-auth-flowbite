import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";
import authDataReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    authData: authDataReducer,
  },
});
