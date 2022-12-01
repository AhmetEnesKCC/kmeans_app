import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loop: 100,
  algo: "",
  data: "",
  norm: "",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettings(state, action) {
      return action.payload;
    },
  },
});

export const { setSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
