import { configureStore } from "@reduxjs/toolkit";
import mqttReducer from "./mqttSlice";

export const store = configureStore({
  reducer: {
    mqtt: mqttReducer,
  },
});

export default store;