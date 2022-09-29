import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const summarySlice = createSlice({
  initialState,
  name: "showSummary",
  reducers: {
    setSummary: (_, action) => {
      return action.payload;
    },
  },
});

export default summarySlice.reducer;

export const { setSummary } = summarySlice.actions;
