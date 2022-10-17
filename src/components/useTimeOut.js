import {useState} from 'react';
 
function useTimeout({action, time}){
    const [timeOut, setTime] = useState(0);
    function handleChange(value){
        if(timeOut) clearTimeout(timeOut);
        setTime(
            setTimeout(() => {action(value)}, time)
        );
    }
    return handleChange;
}
 
export default useTimeout;