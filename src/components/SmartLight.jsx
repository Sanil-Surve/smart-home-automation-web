import { useState, useEffect, useRef, useMemo } from "react";
import mqtt from "mqtt";
import { Card, Flex, Switch } from "antd";
import Lottie from "react-lottie-player";
import animationData from "../assets/bulb-animation.json";

const MQTT_BROKER = import.meta.env.VITE_MQTT_BROKER;
const MQTT_TOPIC = import.meta.env.VITE_MQTT_TOPIC;
const MQTT_USER = import.meta.env.VITE_MQTT_USER;
const MQTT_PASS = import.meta.env.VITE_MQTT_PASS;

const SmartLight = () => {
  const [status, setStatus] = useState("OFF");
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
      mqttClient.subscribe(MQTT_TOPIC);
    });

    mqttClient.on("message", (topic, message) => {
      console.log(`📩 Message received on ${topic}: ${message.toString()}`);
      setStatus(message.toString());
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
        clientRef.current.unsubscribe(MQTT_TOPIC);
        clientRef.current.end(true);
      }
    };
  }, []);

  const toggleLight = (checked) => {
    if (!clientRef.current?.connected) {
      console.error("❌ MQTT client is not connected.");
      return;
    }

    const newStatus = checked ? "ON" : "OFF";
    if (newStatus !== status) {
      clientRef.current.publish(MQTT_TOPIC, newStatus);
      setStatus(newStatus);
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
      <h1 className="md:text-2xl font-semibold mb-10 text-gray-800 dark:text-gray-200">
        Zenith Smart
      </h1>

      <Flex justify="center" align="center">
        {LightAnimation}
      </Flex>

      <h3 className="mt-10 text-lg text-gray-700 dark:text-gray-300">
        Light is <strong className="text-blue-600">{status}</strong>
      </h3>

      <h3 className="mt-5 text-gray-600">
        MQTT Status:{" "}
        <span className={isConnected ? "text-green-500" : "text-red-500"}>
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </h3>

      <Switch
        checked={status === "ON"}
        onChange={toggleLight}
        checkedChildren="ON"
        unCheckedChildren="OFF"
        className="mt-5"
        style={{
          backgroundColor: status === "ON" ? "green" : "red",
          borderColor: status === "ON" ? "green" : "red",
          transform: "scale(1.5)", 
          padding: "8px", 
        }}
      />
    </Card>
  );
};

export default SmartLight;
