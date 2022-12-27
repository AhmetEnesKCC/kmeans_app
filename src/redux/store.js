import { configureStore } from "@reduxjs/toolkit";
import argumentSlice from "./argumentSlice";
import codeStatusSlice from "./codeStatusSlice";
import infoSlice from "./infoSlice";
import menubarSlice from "./menubarSlice";
import outputScreenSlice from "./outputScreenSlice";
import settingsSlice from "./settingsSlice";
import summarySlice from "./summarySlice";
import uiSlice from "./uiSlice";

const rootReducer = {
  selectedArguments: argumentSlice,
  codeStatus: codeStatusSlice,
  showSummary: summarySlice,
  contentInfo: infoSlice,
  menubar: menubarSlice,
  ui: uiSlice,
  settings: settingsSlice,
  outputScreen: outputScreenSlice,
};

const Store = configureStore({
  reducer: rootReducer,
});

export default Store;
