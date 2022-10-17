
import { useState } from 'react';
import Switch from "react-switch";
import Loader from './Loader';
 
function Switcher({ handleStatus, status, item_id }) {
    const [loading, setLoading] = useState(false);
    const handleChange = (value) => {
        setLoading(true)
        handleStatus({ setLoading, value, item_id })
    }
    return (
        <div className="w-12 h-12 flex justify-center items-center">
        {loading ?
            <Loader size="md" />
            :
            <Switch
                onChange={handleChange}
                checked={status}
                checkedIcon={false}
                onColor="#34D399"
                height={18}
                width={37}
            />
        }
        </div>
    )
}
 
export default Switcher;