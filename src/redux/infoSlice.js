const { createSlice } = require("@reduxjs/toolkit");

const initialState = null;

const infoSlice = createSlice({
  initialState,
  name: "content-info",
  reducers: {
    setContentInfo(state, action) {
      return action.payload;
    },
  },
});

export const { setContentInfo } = infoSlice.actions;
export default infoSlice.reducer;
