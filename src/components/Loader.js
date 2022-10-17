import Lottie from "lottie-react";
import loader from "../assets/loader.json";

function Loader({size}) {
  return (
      <div className={`z-50 ${size === 'xs' ? 'w-8' : size === 'sm' ? 'w-12' : size === 'md' ? 'w-16' : size === 'lg' ? 'w-20' : size === 'xl' ? 'w-24' : size === '2xl' ? 'w-28' : 'w-64' }`}>
        <Lottie animationData={loader} />
      </div>
  );
}

export default Loader;