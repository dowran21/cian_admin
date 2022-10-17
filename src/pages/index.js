import {Route, Routes} from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { routes } from './routes';
import { GoSignOut } from "@react-icons/all-files/go/GoSignOut";
import {useDispatch, useSelector} from 'react-redux'
import { Logout } from '../application/middlewares/auth';


function Home(){
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    return(
        <div className="flex flex-row justify-start items-start h-full w-full">
            <div className="flex flex-col justify-between h-full overflow-y-auto overflow-x-hidden sm:min-w-250 max-w-250 w-11 sm:w-full z-20 shadow-lg">
                <Sidebar routes={routes} user={user}/>
                <button onClick={() => dispatch(Logout())} className="w-full flex flex-row justify-start items-center text-gray-600 pl-3 sm:pl-5 focus:outline-none hover:bg-blue-50 active:bg-white py-2">
                    <GoSignOut className="text-xl sm:text-2xl"/>
                    <span className="ml-5 hidden sm:flex">Выйти</span>
                </button>
            </div>
            <div className="h-full overflow-x-auto col-start-3 bg-blue-50 w-full">
                <Routes>
                    {routes.map(item => {
                        if(item.roles[user?.role_id]){
                            return <Route key={item.id} index={item.index} path={item.path} element={item.element} />
                        }else return null;
                    })}
                </Routes>
            </div>
        </div>
    );
};



export default Home;