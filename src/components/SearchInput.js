import { func, string } from 'prop-types';
import useTimeOut from './useTimeOut';
import {GoSearch} from "@react-icons/all-files/go/GoSearch";


 
function SearchInput({placeholder, action}){
    const handleSearch = useTimeOut({time:1500, action:(value) => action(value)});
    return(
        <div className="relative w-full">
            <div className="absolute top-1 left-2 inset-y-0 flex items-center pl-1">
                <GoSearch className="text-xl text-indigo-600" aria-hidden="true" />
            </div>
            <input
                className="pr-4 pl-10 h-10 text-gray-700 rounded-2xl appearance-none w-full bg-white shadow-sm placeholder-gray-400 focus:shadow-inner text-sm focus:outline-none"
                onChange={(e) =>handleSearch(e.target.value)} 
                type="search" name="search" id="search" placeholder={placeholder}
            />
        </div>
    );
};
 
SearchInput.propTypes = {
    placeholder:string.isRequired,
    action:func.isRequired
}
 
export default SearchInput;