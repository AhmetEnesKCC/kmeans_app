import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "light",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state, action) => action.payload,
  },
});

export const { setTheme } = uiSlice.actions;

export default uiSlice.reducer;
