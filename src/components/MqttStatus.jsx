import { useSelector } from "react-redux";

const MqttStatus = () => {
  const isConnected = useSelector((state) => state.mqtt.isConnected);

  return (
    <h3 className="text-center mt-4">
      MQTT Status: <span className={isConnected ? "text-green-500" : "text-red-500"}>{isConnected ? "Connected" : "Disconnected"}</span>
    </h3>
  );
};

export default MqttStatus;