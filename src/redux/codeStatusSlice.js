import { createSlice } from "@reduxjs/toolkit";

const initialState = "idle";

const codeStatusSlice = createSlice({
  name: "codeStatus",
  initialState,
  reducers: {
    setCodeStatus(state, action) {
      return action.payload;
    },
  },
});

export const { setCodeStatus } = codeStatusSlice.actions;

export default codeStatusSlice.reducer;
