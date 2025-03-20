import { lazy, Suspense } from "react";
import Lottie from "react-lottie-player";
import loader from "./assets/loader.json";

const SmartHome = lazy(() => import("./components/SmartHome"));

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center h-screen">
          <Lottie loop animationData={loader} play className="w-48 h-48" />
          <p className="text-lg text-gray-500 mt-4">Loading Smart Home...</p>
        </div>
      }
    >
      <SmartHome />
    </Suspense>
  );
}

export default App;

