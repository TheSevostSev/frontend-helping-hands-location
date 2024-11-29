import { createSlice } from "@reduxjs/toolkit";

// Initial state for the user slice
const initialState = {
  username: "",
  password: "",
  isLoggedIn: false,
  token: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isLoggedIn = true;
    },
    resetUser: (state) => {
      state.username = "";
      state.password = "";
      state.isLoggedIn = false;
    },
  },
});

export const selectUser = (state) => state.user;
export const selectUsername = (state) => state.user.username;
export const selectPassword = (state) => state.user.password;
export const selectIsLoggedIn = (state) => state.user.isLoggedIn;

export const { setUsername, setPassword, resetUser, setToken } =
  userSlice.actions;
export default userSlice.reducer;
