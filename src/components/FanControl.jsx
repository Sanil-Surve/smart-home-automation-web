import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Card, Switch, Flex } from "antd";
import Lottie from "react-lottie-player";
import fanData from "../assets/fan.json";

const FanControl = ({ toggleDevice }) => {
  const fanStatus = useSelector((state) => state.mqtt.fanStatus);

  return (
    <Card className="text-center p-4 shadow-md rounded-md bg-gray-800 text-white">
      <h2 className="text-2xl font-semibold">Kitchen</h2>
      <Flex justify="center">
        <div className="w-64 h-64 flex items-center justify-center">
          <Lottie loop animationData={fanData} play className="w-full h-full" />
        </div>
      </Flex>
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
    </Card>
  );
};

FanControl.propTypes = {
  toggleDevice: PropTypes.func.isRequired,
};

export default FanControl;