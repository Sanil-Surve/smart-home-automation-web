import useMQTTClient from "./MQTTClient";
import LightControl from "./LightControl";
import FanControl from "./FanControl";
import { Card } from "antd";
import MqttStatus from "./MqttStatus";

const SmartHome = () => {
  const { toggleDevice } = useMQTTClient();

  return (
    <Card className="text-center mt-10 p-8 shadow-xl rounded-xl bg-gray-800 text-white space-y-8">
      <h1 className="text-2xl font-semibold">Home Automation App</h1>
      <LightControl toggleDevice={toggleDevice} />
      <FanControl toggleDevice={toggleDevice} />
      <MqttStatus />
    </Card>
  );
};

export default SmartHome;