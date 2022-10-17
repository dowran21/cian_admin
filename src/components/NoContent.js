import Lottie from "lottie-react";
import nocontent from "../assets/no_content.json";

function NoContent({title}) {
  return (
      <div className="max-w-xs w-full flex flex-col justify-center items-center">
            <div className="w-64">
                <Lottie animationData={nocontent} />
            </div>
            <h1 className="text-lg -mt-4 mb-4">{title}</h1>
      </div>
  );
}

export default NoContent;