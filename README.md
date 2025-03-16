# BE Major Project

Software Information: 

# SmartHome Component Documentation

## Overview
The `SmartHome` component connects to an MQTT broker to control and monitor smart home devices, specifically a light bulb and a fan. The UI displays the status of the devices and allows users to toggle them on or off.

## Dependencies
- `react`
- `mqtt`
- `antd` (for UI components)
- `react-lottie-player` (for animations)
- Environment variables for MQTT broker and topics

## Environment Variables
- `VITE_MQTT_BROKER`: URL of the MQTT broker
- `VITE_MQTT_LIGHT_TOPIC`: MQTT topic for the light bulb
- `VITE_MQTT_FAN_TOPIC`: MQTT topic for the fan
- `VITE_MQTT_USER`: MQTT username
- `VITE_MQTT_PASS`: MQTT password

## State Variables
- `lightStatus`: Tracks the current status of the light (`ON` or `OFF`).
- `fanStatus`: Tracks the current status of the fan (`ON` or `OFF`).
- `isConnected`: Tracks the connection status of the MQTT client.

## Refs
- `clientRef`: Stores the MQTT client instance.

## useEffect (MQTT Connection Handling)
- Establishes a connection to the MQTT broker.
- Subscribes to `light` and `fan` topics.
- Listens for messages and updates device statuses accordingly.
- Handles errors and disconnections.
- Cleans up the connection on component unmount.

## Functions
### `toggleDevice(device, checked)`
- Publishes the new device status (`ON` or `OFF`) to the respective MQTT topic.
- Updates the local state if the message is successfully sent.

## UI Components
- **Card**: Contains the entire UI.
- **Lottie Animations**: Displays animations for light and fan.
- **Switch**: Allows users to toggle devices on and off.
- **MQTT Status Indicator**: Displays connection status.

## Optimized Styling
- Improved spacing with reduced margins and padding.
- Styled components using Tailwind CSS classes.
- Used `flexbox` for proper alignment and distribution.

## Export
- `SmartHome` is exported as the default component.

