import { createSlice } from "@reduxjs/toolkit";

const outputScreenSlice = createSlice({
  name: "output-screen",
  initialState: "visit",
  reducers: {
    setOutputScreen(state, action) {
      if (action.payload === "run") {
        return "run";
      } else {
        return "visit";
      }
    },
  },
});

export const { setOutputScreen } = outputScreenSlice.actions;
export default outputScreenSlice.reducer;
