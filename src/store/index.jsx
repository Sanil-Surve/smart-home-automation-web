// import { configureStore } from "@reduxjs/toolkit";
// import mqttReducer from "./mqttSlice";

// export const store = configureStore({
//   reducer: {
//     mqtt: mqttReducer,
//   },
// });

// export default store;

import { configureStore } from "@reduxjs/toolkit";
import mqttReducer from "./mqttSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Local Storage
import { combineReducers } from "redux";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  mqtt: mqttReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export default store;