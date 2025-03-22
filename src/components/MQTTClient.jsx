import { useEffect, useRef } from "react";
import mqtt from "mqtt";
import { useDispatch } from "react-redux";
import { setLightStatus, setFanStatus, setConnectionStatus } from "../store/mqttSlice";

const MQTT_BROKER = import.meta.env.VITE_MQTT_BROKER;
const MQTT_LIGHT_TOPIC = import.meta.env.VITE_MQTT_LIGHT_TOPIC;
const MQTT_FAN_TOPIC = import.meta.env.VITE_MQTT_FAN_TOPIC;
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
      mqttClient.subscribe([MQTT_LIGHT_TOPIC, MQTT_FAN_TOPIC]);
    });

    mqttClient.on("message", (topic, message) => {
      console.log(`📩 Message received on ${topic}: ${message.toString()}`);
      if (topic === MQTT_LIGHT_TOPIC) {
        dispatch(setLightStatus(message.toString()));
      } else if (topic === MQTT_FAN_TOPIC) {
        dispatch(setFanStatus(message.toString()));
      }
    });

    mqttClient.on("error", () => dispatch(setConnectionStatus(false)));
    mqttClient.on("close", () => dispatch(setConnectionStatus(false)));

    clientRef.current = mqttClient;

    return () => {
      clientRef.current?.unsubscribe([MQTT_LIGHT_TOPIC, MQTT_FAN_TOPIC]);
      clientRef.current?.end(true);
    };
  }, [dispatch]);

  const toggleDevice = (device, checked) => {
    if (!clientRef.current?.connected) return;
    const newStatus = checked ? "ON" : "OFF";
    const topic = device === "light" ? MQTT_LIGHT_TOPIC : MQTT_FAN_TOPIC;

    clientRef.current.publish(topic, newStatus);

    if (device === "light") {
      dispatch(setLightStatus(newStatus));
    } else {
      dispatch(setFanStatus(newStatus));
    }
  };

  return { toggleDevice };
};

export default useMQTTClient;
