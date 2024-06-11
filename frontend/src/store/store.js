import {
  configureStore,
  combineReducers,
  
} from "@reduxjs/toolkit";
import authSlice from "../features/authSlice";
import uiSettingsSlice from "../features/uiSettingsSlice ";
import socketSlice from "../features/socketSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { handleChapterUpload } from "../thunks/socketThunks";

const authPersitConfig = {
  key: "auth",
  storage,
};

const uiSettingsPersitConfig = {
  key: "uiSettings",
  storage,
};

const socketPersitConfig = {
  key: "socket",
  storage,
};

const socketMiddleWare = (store) => (next) => (action) => {
  if (action.type.startsWith("socket/")) {
    store.dispatch(action);
  } else {
    console.log(next);
    next(action);
  }
};

const persistedAuthReducer = persistReducer(authPersitConfig, authSlice);
const persisteduiSettingsReducer = persistReducer(
  uiSettingsPersitConfig,
  uiSettingsSlice,
);
const persistedsocketReducer = persistReducer(socketPersitConfig, socketSlice);

const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  uiSettings: persisteduiSettingsReducer,
  socket: persistedsocketReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  thunk: [handleChapterUpload]
});

export const persistor = persistStore(store);