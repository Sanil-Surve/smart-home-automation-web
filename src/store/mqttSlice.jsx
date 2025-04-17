// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   lightStatus: "OFF",
//   fanStatus: "OFF",
//   isConnected: false,
// };

// const mqttSlice = createSlice({
//   name: "mqtt",
//   initialState,
//   reducers: {
//     setLightStatus: (state, action) => {
//       state.lightStatus = action.payload;
//     },
//     setFanStatus: (state, action) => {
//       state.fanStatus = action.payload;
//     },
//     setConnectionStatus: (state, action) => {
//       state.isConnected = action.payload;
//     },
//   },
// });

// export const { setLightStatus, setFanStatus, setConnectionStatus } = mqttSlice.actions;
// export default mqttSlice.reducer;


//====================================================


// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   lightStatus: "OFF",
//   fanStatus: "OFF",
//   isConnected: false,
// };

// const mqttSlice = createSlice({
//   name: "mqtt",
//   initialState,
//   reducers: {
//     setStatus: (state, { payload: { device, status } }) => {
//       if (device === "light") state.lightStatus = status;
//       else if (device === "fan") state.fanStatus = status;
//     },
//     setConnectionStatus: (state, { payload }) => {
//       state.isConnected = payload;
//     },
//   },
// });

// export const { setStatus, setConnectionStatus } = mqttSlice.actions;
// export default mqttSlice.reducer;


// =============================


import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lightStatus: "OFF",
  fanStatus: "OFF",
  temperature: null,
  humidity: null,
  isConnected: false,
};

const mqttSlice = createSlice({
  name: "mqtt",
  initialState,
  reducers: {
    setStatus: (state, { payload: { device, status } }) => {
      if (device === "light") state.lightStatus = status;
      else if (device === "fan") state.fanStatus = status;
    },
    setSensorData: (state, { payload: { sensor, value } }) => {
      if (sensor === "temperature") state.temperature = value;
      else if (sensor === "humidity") state.humidity = value;
    },
    setConnectionStatus: (state, { payload }) => {
      state.isConnected = payload;
    },
  },
});

export const { setStatus, setSensorData, setConnectionStatus } = mqttSlice.actions;
export default mqttSlice.reducer;
