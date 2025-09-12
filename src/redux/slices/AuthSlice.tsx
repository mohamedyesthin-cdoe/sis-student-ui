import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { logout } from "../../services/AuthServices";


interface AuthState {
  user: any | null; // You can replace `any` with a defined User interface
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: !!localStorage.getItem("access"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      // Replace `any` with your custom `User` type if available
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      logout();
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
