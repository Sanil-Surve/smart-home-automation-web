import { useSelector } from "react-redux";

const SensorDisplay = () => {
  const temperature = useSelector((state) => state.mqtt.temperature);
  const humidity = useSelector((state) => state.mqtt.humidity);

  return (
    <div className="flex justify-around items-center bg-gray-700 p-4 rounded-lg shadow">
      <div className="text-center">
        <p className="text-sm text-gray-300">Temperature</p>
        <p className="text-xl font-bold text-yellow-400">
          {temperature ? `${temperature}°C` : "--"}
        </p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-300">Humidity</p>
        <p className="text-xl font-bold text-blue-400">
          {humidity ? `${humidity}%` : "--"}
        </p>
      </div>
    </div>
  );
};

export default SensorDisplay;