import { useState } from 'react';
function Label({ children }) {
    const [visible, setVisible] = useState(false);
    return (
        <div onClick={() => setVisible(!visible)} className={`${visible ? '' : 'w-full sm:max-w-200 md:max-w-250 lg:max-w-xs overflow-ellipsis overflow-hidden md:whitespace-nowrap'} text-base hover:text-blue-500 cursor-pointer px-2`}>
            {children}
        </div>
    )
};

export default Label;