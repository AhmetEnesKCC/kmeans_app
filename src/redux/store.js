import { configureStore } from "@reduxjs/toolkit";
import argumentSlice from "./argumentSlice";
import codeStatusSlice from "./codeStatusSlice";
import infoSlice from "./infoSlice";
import menubarSlice from "./menubarSlice";
import summarySlice from "./summarySlice";

const rootReducer = {
  selectedArguments: argumentSlice,
  codeStatus: codeStatusSlice,
  showSummary: summarySlice,
  contentInfo: infoSlice,
  menubar: menubarSlice,
};

const Store = configureStore({
  reducer: rootReducer,
});

export default Store;
