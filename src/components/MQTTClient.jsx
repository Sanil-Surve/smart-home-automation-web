import { useEffect, useRef } from "react";
import mqtt from "mqtt";
import { useDispatch } from "react-redux";
import {
  setStatus,
  setConnectionStatus,
  setSensorData,
} from "../store/mqttSlice";

const MQTT_BROKER = import.meta.env.VITE_MQTT_BROKER;
const MQTT_LIGHT_TOPIC = import.meta.env.VITE_MQTT_LIGHT_TOPIC;
const MQTT_FAN_TOPIC = import.meta.env.VITE_MQTT_FAN_TOPIC;
const MQTT_TEMP_TOPIC = import.meta.env.VITE_MQTT_TEMP_TOPIC;
const MQTT_HUMIDITY_TOPIC = import.meta.env.VITE_MQTT_HUMIDITY_TOPIC;
const MQTT_USER = import.meta.env.VITE_MQTT_USER;
const MQTT_PASS = import.meta.env.VITE_MQTT_PASS;

const useMQTTClient = () => {
  const dispatch = useDispatch();
  const clientRef = useRef(null);

  useEffect(() => {
    const mqttClient = mqtt.connect(MQTT_BROKER, {
      username: MQTT_USER,
      password: MQTT_PASS,
      protocolVersion: 5,
      reconnectPeriod: 1000,
      keepalive: 60,
      clean: true,
    });

    mqttClient.on("connect", () => {
      console.log("✅ Connected to MQTT Broker");
      dispatch(setConnectionStatus(true));
      mqttClient.subscribe([
        MQTT_LIGHT_TOPIC,
        MQTT_FAN_TOPIC,
        MQTT_TEMP_TOPIC,
        MQTT_HUMIDITY_TOPIC,
      ]);
    });

    mqttClient.on("message", (topic, message) => {
      const value = message.toString();
      console.log(`📩 Message received on ${topic}: ${value}`);

      if (topic === MQTT_LIGHT_TOPIC) {
        dispatch(setStatus({ device: "light", status: value }));
      } else if (topic === MQTT_FAN_TOPIC) {
        dispatch(setStatus({ device: "fan", status: value }));
      } else if (topic === MQTT_TEMP_TOPIC) {
        dispatch(setSensorData({ sensor: "temperature", value }));
      } else if (topic === MQTT_HUMIDITY_TOPIC) {
        dispatch(setSensorData({ sensor: "humidity", value }));
      }
    });

    mqttClient.on("error", () => dispatch(setConnectionStatus(false)));
    mqttClient.on("close", () => dispatch(setConnectionStatus(false)));

    clientRef.current = mqttClient;

    return () => {
      clientRef.current?.unsubscribe([
        MQTT_LIGHT_TOPIC,
        MQTT_FAN_TOPIC,
        MQTT_TEMP_TOPIC,
        MQTT_HUMIDITY_TOPIC,
      ]);
      clientRef.current?.end(true);
    };
  }, [dispatch]);

  const toggleDevice = (device, checked) => {
    if (!clientRef.current?.connected) return;
    const status = checked ? "ON" : "OFF";
    const topic = device === "light" ? MQTT_LIGHT_TOPIC : MQTT_FAN_TOPIC;

    clientRef.current.publish(topic, status);
    dispatch(setStatus({ device, status }));
  };

  return { toggleDevice };
};

export default useMQTTClient;

