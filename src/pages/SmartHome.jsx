import { useState, useEffect, useRef } from "react";
import mqtt from "mqtt";
import { Card, Flex, Switch } from "antd";
import Lottie from "react-lottie-player";
import lightData from "../assets/bulb-animation.json";
import fanData from "../assets/fan.json";

const MQTT_BROKER = import.meta.env.VITE_MQTT_BROKER;
const MQTT_LIGHT_TOPIC = import.meta.env.VITE_MQTT_LIGHT_TOPIC;
const MQTT_FAN_TOPIC = import.meta.env.VITE_MQTT_FAN_TOPIC;
const MQTT_USER = import.meta.env.VITE_MQTT_USER;
const MQTT_PASS = import.meta.env.VITE_MQTT_PASS;

const SmartHome = () => {
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
      console.log("✅ Connected to MQTT");
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

    mqttClient.on("error", () => setIsConnected(false));
    mqttClient.on("close", () => setIsConnected(false));
    clientRef.current = mqttClient;

    return () => {
      clientRef.current?.unsubscribe([MQTT_LIGHT_TOPIC, MQTT_FAN_TOPIC]);
      clientRef.current?.end(true);
    };
  }, []);

  const toggleDevice = (device, checked) => {
    if (!clientRef.current?.connected) return;
    const newStatus = checked ? "ON" : "OFF";
    const topic = device === "light" ? MQTT_LIGHT_TOPIC : MQTT_FAN_TOPIC;
    const currentStatus = device === "light" ? lightStatus : fanStatus;

    if (newStatus !== currentStatus) {
      clientRef.current.publish(topic, newStatus);
      device === "light" ? setLightStatus(newStatus) : setFanStatus(newStatus);
    }
  };

  const renderAnimation = (data) => (
    <div className="w-64 h-64 flex items-center justify-center">
      <Lottie loop animationData={data} play className="w-full h-full" />
    </div>
  );

  return (
    <Card className="text-center mt-10 p-8 shadow-xl rounded-xl bg-gray-800 text-white space-y-8">
      <h1 className="text-2xl font-semibold">BE Major Project</h1>

      <div className="space-y-6">
        <Flex justify="center">{renderAnimation(lightData)}</Flex>
        <h3 className="text-lg">
          Light Bulb: <span className={lightStatus === "ON" ? "text-green-500" : "text-red-500"}>{lightStatus}</span>
        </h3>
        <Switch
          checked={lightStatus === "ON"}
          onChange={(checked) => toggleDevice("light", checked)}
          checkedChildren="ON"
          unCheckedChildren="OFF"
          className="scale-125"
          style={{ backgroundColor: lightStatus === "ON" ? "green" : "red" }}
        />
      </div>

      <div className="space-y-6">
        <Flex justify="center">{renderAnimation(fanData)}</Flex>
        <h3 className="text-lg">
          Fan: <span className={fanStatus === "ON" ? "text-green-500" : "text-red-500"}>{fanStatus}</span>
        </h3>
        <Switch
          checked={fanStatus === "ON"}
          onChange={(checked) => toggleDevice("fan", checked)}
          checkedChildren="ON"
          unCheckedChildren="OFF"
          className="scale-125"
          style={{ backgroundColor: fanStatus === "ON" ? "green" : "red" }}
        />
      </div>

      <h3>
        MQTT Status: <span className={isConnected ? "text-green-500" : "text-red-500"}>{isConnected ? "Connected" : "Disconnected"}</span>
      </h3>
    </Card>
  );
};

export default SmartHome;

