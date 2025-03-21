import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Card, Switch, Flex } from "antd";
import Lottie from "react-lottie-player";
import lightData from "../assets/bulb-animation.json";

const LightControl = ({ toggleDevice }) => {
  const lightStatus = useSelector((state) => state.mqtt.lightStatus);

  return (
    <Card className="text-center p-4 shadow-md rounded-md bg-gray-800 text-white">
        <h2 className="text-2xl font-semibold">Bed Room</h2>
      <Flex justify="center">
        <div className="w-64 h-64 flex items-center justify-center">
          <Lottie loop animationData={lightData} play className="w-full h-full" />
        </div>
      </Flex>
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
    </Card>
  );
};

LightControl.propTypes = {
  toggleDevice: PropTypes.func.isRequired,
};

export default LightControl;