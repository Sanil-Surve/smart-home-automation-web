import { useState, useEffect, useRef, useMemo } from "react";
import mqtt from "mqtt";
import { Card, Flex, Switch } from "antd";
import Lottie from "react-lottie-player";
import animationData from "../assets/bulb-animation.json";

const MQTT_BROKER = import.meta.env.VITE_MQTT_BROKER;
const MQTT_LIGHT_TOPIC = import.meta.env.VITE_MQTT_LIGHT_TOPIC;
const MQTT_FAN_TOPIC = import.meta.env.VITE_MQTT_FAN_TOPIC;
const MQTT_USER = import.meta.env.VITE_MQTT_USER;
const MQTT_PASS = import.meta.env.VITE_MQTT_PASS;

const SmartLight = () => {
  const [lightStatus, setLightStatus] = useState("OFF");
  const [fanStatus, setFanStatus] = useState("OFF");
  const [isConnected, setIsConnected] = useState(false);
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
      setIsConnected(true);
      mqttClient.subscribe([MQTT_LIGHT_TOPIC, MQTT_FAN_TOPIC]);
    });

    mqttClient.on("message", (topic, message) => {
      console.log(`📩 Message received on ${topic}: ${message.toString()}`);
      if (topic === MQTT_LIGHT_TOPIC) {
        setLightStatus(message.toString());
      } else if (topic === MQTT_FAN_TOPIC) {
        setFanStatus(message.toString());
      }
    });

    mqttClient.on("error", (error) => {
      console.error("❌ MQTT Connection Error:", error);
      setIsConnected(false);
    });

    mqttClient.on("close", () => {
      console.warn("🔌 MQTT Disconnected");
      setIsConnected(false);
    });

    clientRef.current = mqttClient;

    return () => {
      if (clientRef.current) {
        clientRef.current.unsubscribe([MQTT_LIGHT_TOPIC, MQTT_FAN_TOPIC]);
        clientRef.current.end(true);
      }
    };
  }, []);

  const toggleDevice = (device, checked) => {
    if (!clientRef.current?.connected) {
      console.error("❌ MQTT client is not connected.");
      return;
    }

    const newStatus = checked ? "ON" : "OFF";
    const topic = device === "light" ? MQTT_LIGHT_TOPIC : MQTT_FAN_TOPIC;
    const currentStatus = device === "light" ? lightStatus : fanStatus;

    if (newStatus !== currentStatus) {
      clientRef.current.publish(topic, newStatus);
      if (device === "light") {
        setLightStatus(newStatus);
      } else {
        setFanStatus(newStatus);
      }
    }
  };

  const LightAnimation = useMemo(
    () => (
      <div className="w-72 h-72 rounded-full overflow-hidden border-4 border-gray-300 shadow-lg flex items-center justify-center">
        <Lottie
          loop
          animationData={animationData}
          play
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    ),
    []
  );

  return (
    <Card className="text-center mt-12 p-6 shadow-lg rounded-xl bg-gray-800">
      <h1 className="md:text-2xl font-semibold mb-10 text-black-200">BE Major Project</h1>

      <Flex justify="center" align="center">{LightAnimation}</Flex>

      <h3 className="mt-10 text-lg text-black-300">
        Light Bulb: <strong className={lightStatus === "ON" ? "text-green-500" : "text-red-500"}>{lightStatus}</strong>
      </h3>

      <Switch
        checked={lightStatus === "ON"}
        onChange={(checked) => toggleDevice("light", checked)}
        checkedChildren="ON"
        unCheckedChildren="OFF"
        className="mt-5"
        style={{
          backgroundColor: lightStatus === "ON" ? "green" : "red",
          borderColor: lightStatus === "ON" ? "green" : "red",
          transform: "scale(1.5)",
          padding: "8px",
        }}
      />

      <h3 className="mt-10 text-lg text-black-300">
        Fan: <strong className={fanStatus === "ON" ? "text-green-500" : "text-red-500"}>{fanStatus}</strong>
      </h3>

      <Switch
        checked={fanStatus === "ON"}
        onChange={(checked) => toggleDevice("fan", checked)}
        checkedChildren="ON"
        unCheckedChildren="OFF" 
        className="mt-5"
        style={{
          backgroundColor: fanStatus === "ON" ? "green" : "red",
          borderColor: fanStatus === "ON" ? "green" : "red",
          transform: "scale(1.5)",
          padding: "8px",
        }}
      />

      <h3 className="mt-5 text-black-300">
        MQTT Status: <span className={isConnected ? "text-green-500" : "text-red-500"}>{isConnected ? "Connected" : "Disconnected"}</span>
      </h3>
    </Card>
  );
};

export default SmartLight;



