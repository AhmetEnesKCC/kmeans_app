import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  algo: [],
  data: [],
  norm: [],
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
    setSelectedNormalizations(state, action) {
      state.norm = action.payload;
    },
    setLoop(state, action) {
      state.loop = action.payload;
    },
    setArguments(state, action) {
      return action.payload;
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
  setSelectedNormalizations,
  setLoop,
  setArguments,
  setArgumentByKey,
} = argumentSlice.actions;
