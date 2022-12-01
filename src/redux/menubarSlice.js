import { createSlice } from "@reduxjs/toolkit";

const initialState = "file-explorer";

const menubarSlice = createSlice({
  initialState,
  name: "menubar",
  reducers: {
    setMenubar(state, action) {
      return action.payload;
    },
  },
});

export default menubarSlice.reducer;

export const { setMenubar } = menubarSlice.actions;
