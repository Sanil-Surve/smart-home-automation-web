import useMQTTClient from "./MQTTClient";
import LightControl from "./LightControl";
import FanControl from "./FanControl";
import MqttStatus from "./MqttStatus";
import SensorDisplay from "./SensorDisplay"; // <-- Import new component
import { Card } from "antd";

const SmartHome = () => {
  const { toggleDevice } = useMQTTClient();

  return (
    <Card className="text-center mt-10 p-8 shadow-xl rounded-xl bg-gray-800 text-white space-y-8">
      <h1 className="text-2xl font-semibold">Smart Home Automation</h1>
      <SensorDisplay />
      <LightControl toggleDevice={toggleDevice} />
      <FanControl toggleDevice={toggleDevice} />
      <MqttStatus />
    </Card>
  );
};

export default SmartHome;