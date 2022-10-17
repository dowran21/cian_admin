import Tooltips from "@material-tailwind/react/Tooltips";
import TooltipsContent from "@material-tailwind/react/TooltipsContent";
import React, { useRef } from "react";


function IconButton({icon, handleClick, tooltip}){
    const buttonRef = useRef();
    return(
        <>
        <button type="button" ref = {buttonRef} ripple="light" onClick={handleClick} className="flex justify-center items-center w-10 h-10 mx-2 hover:text-white hover:bg-indigo-600 active:bg-white active:text-indigo-600 rounded-md focus:outline-none shadow-lg text-indigo-600 bg-white">
            {icon}
        </button>
        <Tooltips placement="top" ref={buttonRef}>
            <TooltipsContent>{tooltip}</TooltipsContent>
        </Tooltips>
    </>
    );
};

export default IconButton;