import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "./types";

interface AuthState { user: User | null; token: string | null; }
const storedUser = localStorage.getItem("careernest_user");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: localStorage.getItem("careernest_token")
  } as AuthState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("careernest_user", JSON.stringify(action.payload.user));
      localStorage.setItem("careernest_token", action.payload.token);
    },
    logout: (state) => {
      state.user = null; state.token = null;
      localStorage.removeItem("careernest_user");
      localStorage.removeItem("careernest_token");
    }
  }
});

export const { setAuth, logout } = authSlice.actions;
export const store = configureStore({ reducer: { auth: authSlice.reducer } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
