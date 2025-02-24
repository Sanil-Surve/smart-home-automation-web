import { useState, useEffect } from "react";
import mqtt from "mqtt";
import { Card, Flex, Switch } from "antd";
import Lottie from "react-lottie-player";
import animationData from "../assets/smart-home-automation.json";

// const MQTT_BROKER =
//   "wss://6f1c98735bdf4eaba03dc8ef028374d3.s1.eu.hivemq.cloud:8884/mqtt";
// const MQTT_TOPIC = "home/light";
// const MQTT_USER = "student";
// const MQTT_PASS = "Student1";

const MQTT_BROKER = import.meta.env.VITE_MQTT_BROKER;
const MQTT_TOPIC = import.meta.env.VITE_MQTT_TOPIC;
const MQTT_USER = import.meta.env.VITE_MQTT_USER;
const MQTT_PASS = import.meta.env.VITE_MQTT_PASS;

const SmartLight = () => {
  const [status, setStatus] = useState("OFF");
  const [client, setClient] = useState(null);

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
      console.log("Connected to MQTT");
      mqttClient.subscribe(MQTT_TOPIC);
    });

    mqttClient.on("message", (topic, message) => {
      console.log(`Message received on ${topic}:`, message.toString());
      setStatus(message.toString());
    });

    mqttClient.on("error", (error) => {
      console.error("MQTT Connection Error:", error);
    });

    setClient(mqttClient);

    return () => {
      mqttClient.end(); // Disconnect on unmount
    };
  }, []);

  const toggleLight = (checked) => {
    if (client && client.connected) {
      const newStatus = checked ? "ON" : "OFF";
      client.publish(MQTT_TOPIC, newStatus);
      setStatus(newStatus);
    } else {
      console.error("MQTT client is not connected.");
    }
  };

  return (
    <Card className="text-center mt-12">
      <h1 className="md:text-2xl font-semibold mb-40">Smart Home Automation</h1>
      <Flex justify="center" align="center">
        <Lottie
          loop
          animationData={animationData}
          play
          style={{ width: 300, height: 300 }}
        />
      </Flex>

      <h3 className="mt-10">
        Light is <strong>{status}</strong>
      </h3>
      <Switch
        checked={status === "ON"}
        onChange={toggleLight}
        checkedChildren="ON"
        unCheckedChildren="OFF"
        className="bg-gray-300"
        style={{
          backgroundColor: status === "ON" ? "green" : "red",
          borderColor: status === "ON" ? "green" : "red",
        }}
      />
    </Card>
  );
};

export default SmartLight;
