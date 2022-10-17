import {NavLink, useLocation} from 'react-router-dom';
import Logo from '../components/Logo';

const NavElement = ({item}) =>{
    const location = useLocation().pathname.split('/')[1];
    return (
        <NavLink to={item.link} className={({isActive}) => `${isActive ? 'sm:bg-blue-50 text-orange' : 'text-gray-600'} relative grid grid-cols-5 my-2 w-full sm:hover:bg-blue-50 active:bg-white`}>
            <div className={`${location === item.link ? 'bg-indigo-600 rounded-r-full text-white' : ''} col-span-1 remove-button-bg p-1 sm:p-2 overflow-hidden w-10 sm:w-12`}>
                <item.icon className="text-xl sm:text-2xl ml-1"/>
            </div>
            <h3 className="col-span-4 whitespace-nowrap font-medium pl-3 py-2 hidden sm:flex">{item.title}</h3>
        </NavLink >
    )
};

function Sidebar({routes, user}){
    return(
        <div className="flex flex-col justify-between items-start w-full">
            <Logo/>
            <div className="flex w-full flex-col justify-start items-start h-full">
                {routes.map(item => {
                    if(item.roles[user?.role_id]){
                        return <NavElement key={item.id} item={item}/>
                    }else{
                        return null
                    }
                })}
            </div>
        </div>
    );
};

export default Sidebar;