import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  algorithms: [],
  datasets: [],
  normalizations: [],
  loop: 100,
};

const argumentSlice = createSlice({
  initialState,
  name: "selectedArguments",
  reducers: {
    setSelectedAlgos(state, action) {
      state.algorithms = action.payload;
    },
    setSelectedDatasets(state, action) {
      state.datasets = action.payload;
    },
    setSelectedNormalizations(state, action) {
      state.normalizations = action.payload;
    },
    setLoop(state, action) {
      state.loop = action.payload;
    },
    setArguments(state, action) {
      return action.payload;
    },
  },
});

export default argumentSlice.reducer;

export const {
  setSelectedAlgos,
  setSelectedDatasets,
  setSelectedNormalizations,
  setLoop,
} = argumentSlice.actions;
