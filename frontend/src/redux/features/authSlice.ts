import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  justLoggedOut: boolean;
}

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  justLoggedOut: false,
} as AuthState;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state) => {
      state.isAuthenticated = true;
      state.isLoading = false; // Auth check completed
      state.justLoggedOut = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.isLoading = false; // Auth check completed
      state.justLoggedOut = true;
    },
    finishInitialLoad: (state) => {
      state.isLoading = false;
    },
    clearJustLoggedOut: (state) => {
      state.justLoggedOut = false;
    },
  },
});

export const { setAuth, logout, finishInitialLoad, clearJustLoggedOut } = authSlice.actions;
export default authSlice.reducer;
