import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lightStatus: "OFF",
  fanStatus: "OFF",
  isConnected: false,
};

const mqttSlice = createSlice({
  name: "mqtt",
  initialState,
  reducers: {
    setLightStatus: (state, action) => {
      state.lightStatus = action.payload;
    },
    setFanStatus: (state, action) => {
      state.fanStatus = action.payload;
    },
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});

export const { setLightStatus, setFanStatus, setConnectionStatus } = mqttSlice.actions;
export default mqttSlice.reducer;