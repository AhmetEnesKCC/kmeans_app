import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  algo: [],
  data: [],
  loop: 100,
};

const argumentSlice = createSlice({
  initialState,
  name: "selectedArguments",
  reducers: {
    setSelectedAlgos(state, action) {
      state.algo = action.payload;
    },
    setSelectedDatasets(state, action) {
      state.data = action.payload;
    },
    setLoop(state, action) {
      state.loop = action.payload;
    },
    setArguments(state, action) {
      return action.payload;
    },
    resetArguments(state) {
      return initialState;
    },
    setArgumentByKey(state, action) {
      return { ...state, [action.payload.key]: action.payload.value };
    },
  },
});

export default argumentSlice.reducer;

export const {
  setSelectedAlgos,
  setSelectedDatasets,
  setLoop,
  setArguments,
  setArgumentByKey,
  resetArguments,
} = argumentSlice.actions;
