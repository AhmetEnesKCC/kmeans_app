import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "light",
  loading: {
    visible: false,
    title: "",
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
      return state;
    },
    setLoadingVisiblity: (state, action) => {
      state.loading.visible = action.payload;
      return state;
    },
    setLoadingTitle: (state, action) => {
      state.loading.title = action.payload;
      return state;
    },
  },
});

export const { setTheme, setLoading, setLoadingTitle, setLoadingVisiblity } =
  uiSlice.actions;

export default uiSlice.reducer;
