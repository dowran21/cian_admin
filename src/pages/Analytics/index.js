import { useEffect, useReducer} from "react";
import { get } from '../../application/middlewares';
import { useDispatch, useSelector } from "react-redux";
import StatusCard from "../../components/StatusCard"
import toast from "react-hot-toast";
import {FaUserTie} from "@react-icons/all-files/fa/FaUserTie"
import {FaUser} from "@react-icons/all-files/fa/FaUser"
import { MdBusiness } from "@react-icons/all-files/md/MdBusiness";
import BgLoader from "../../components/BgLoader";
import {
    LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, 
    Line, AreaChart, Area, BarChart, Bar, ResponsiveContainer
} from "recharts"

function reducer(state, action){
    switch(action.type){
        case "SET_STATUS":{
            return{
                ...state,
                status:action.payload,
            }
        }
        case "SET_USERS":{
            return{
                ...state,
                user_types:action.payload        
            }
        }
        case "SET_LOADING":{
            return{
                ...state,
                loading:false
            }
        }
        case "SET_PRICE_STAT":{
            return {
                ...state,
                price_data:action.payload
            }
        }
        case "SET_TYPES":{
            return {
                ...state,
                types:action.payload
            }
        }
        case "SET_TYPE_ID" :{
            return {
                ...state,
                type_id:action.payload,
                chart_trigger:!state.chart_trigger
            }
        }
        case "SET_START_DATE":{
            return {
                ...state,
                start_date:action.payload,
                chart_trigger:!state.chart_trigger
            }
        }
        case "SET_END_DATE":{
            return {
                ...state,
                end_date:action.payload,
                chart_trigger:!state.chart_trigger
            }
        }
        case "SET_USER_CHART":{
            return {
                ...state,
                user_chart:action.payload
            }
        }
        case "SET_ESTATE_COUNT" :{
            return {
                ...state,
                estate_chart:action.payload
            }
        }
        case "SET_LOCATIONS_STAT":
            return {
                ...state,
                loaction_stat:action.payload
            }
        case "SET_LOCATIONS":
            return {
                ...state,
                locations:action.payload
            }
        case "SET_LOCATION_ID":
            return {
                ...state,
                location_id:action.payload
            }
        case "SET_VIP_COUNT":
            return {
                ...state,
                vips:action.payload
            }
        default: return state;
    }
}


function Analytics(){

    const [state, setState] = useReducer(reducer, {
        loading:true, user_types:[], status:{}, line_data: [], price_data:[],
        types:[], chart_trigger:false, type_id:'',start_date:"", end_date:"", user_chart:[],
        estate_chart:[], loaction_stat:[], locations:[], location_id:"", vips:[]
    })
    
    const dispatch = useDispatch()
    const token = useSelector(state => state.auth.token)
    // console.log(token)
    useEffect(()=>{
        dispatch(get({
            url: `api/admin/get-active-real-estates`,
            token,
            action: (response) =>{
                if(response.success){
                    setState({type:"SET_STATUS", payload:response.data.rows})
                }else{
                    toast.error("Неизвестная ошибка")
                }
            }
        }));
        dispatch(get({
            url: `api/admin/get-user-types`,
            token,
            action: (response) =>{
                if(response.success){
                    setState({type:"SET_USERS", payload:response.data.rows})
                }else{
                    toast.error("Неизвестная ошибка")
                }
            }
        }));
        dispatch(get({
            url: `api/admin/all-real-estate-statistics`,
            token,
            action: (response) =>{
                // console.log(response)
                if(response.success){
                    }
            }
        }));
        dispatch(get({
            url:`api/admin/get-all-types`,
            token,
            action: (response) =>{
                // console.log(response.data)
                if(response.success){
                    setState({type:"SET_TYPES", payload:response.data.rows})
                }else{
                    toast.error("Неизвестная ошибка призагрузке типов")
                }
            }
        }));
        dispatch(get({
            url:`api/admin/locations-for-select`,
            token,
            action: (response) =>{
                if(response.success){
                    // console.log(response.data, "----locations for select")
                    setState({type:"SET_LOCATIONS", payload:response.data.rows})
                }else{
                    console.log(response)
                    toast.error("Неизвестная ошибка при гет запросе locatins")
                }
            }
        }))
        setState({type:"SET_LOADING", payload:{}});

    }, [])

    useEffect(()=>{
        dispatch(get({
            url: `api/admin/get-price-statistics?type_id=${state.type_id}&start_date=${state.start_date}&end_date=${state.end_date}`,
            token,
            action: (response) =>{
                // console.log(response)
                if(response.success){
                    setState({type:"SET_PRICE_STAT", payload:response.data.rows})
                }
            }
        }));
        dispatch(get({
            url: `api/admin/get-user-chart?start_date=${state.start_date}&end_date=${state.end_date}`,
            token,
            action : (response) =>{
                if(response.success){
                    console.log(response.data)
                    setState({type:"SET_USER_CHART", payload:response.data.rows})
                    console.log(response.data.rows)
                }
            }
        }))
        dispatch(get({
            url : `api/admin/get-real-estate-statistics?start_date=${state.start_date}&end_date=${state.end_date}`,
            token,
            action : (response) =>{
                if(response.success){
                    console.log(response.data)
                    setState({type:"SET_ESTATE_COUNT", payload:response.data.rows})
                }
            }
        }))
        dispatch(get({
            url : `api/admin/get-vip-statistics?start_date=${state.start_date}&end_date=${state.end_date}`,
            token,
            action : (response) =>{
                if(response.success){
                    console.log(response.data)
                    setState({type:"SET_VIP_COUNT", payload:response.data.rows})
                }
            }
        }))

        
    }, [state.chart_trigger])
    useEffect(()=>{
        dispatch(get({
            url:`api/admin/get-location-statistics?main_location_id=${state?.location_id}`,
            token,
            action: (response) =>{
                if(response.success){
                    console.log(response.data.rows)
                    setState({type:"SET_LOCATIONS_STAT", payload:response.data.rows})
                }else{
                    toast.error("Unknown error")
                }
            } 
        }))
    }, [state.location_id])
    return(
        <div className = "pb-10">
            {state.loading ? <BgLoader /> : 
            <>
             <div className="container mx-auto max-w-full py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 mb-4">
                        {state.user_types?.length > 0 && state.user_types.map(item => (
                            <StatusCard key = {item.id} color = {item.id === 1 ? `blue` : `red`} icon = {item.id === 1 ? <FaUser className = "w-full h-full"/> : <FaUserTie className = "w-full h-full"/> }
                            title = {item.id === 1 ? `Собственники` : `Риэторы`} amount = {item.count} />
                        ))
                        }
                        {state.status?.active &&
                            <StatusCard color =  "blue" icon = {<MdBusiness className = "w-full h-full"/>} title = {"Активные объявления"} amount = {state.status.active}/>
                        }
                        {state.status?.deactive &&
                            <StatusCard color =  "red" icon = {<MdBusiness className = "w-full h-full"/>} title = {"Неактивные объявления"} amount = {state.status.deactive} />
                        }
                        
                    </div>
            </div>
            <div className = "p-10 flex flex-row jsutify-center items-beetwen">
                <div className = "pl-3">
                    <label className = "pl-4">Выберите тип</label>
                    <select onChange = {(e)=>setState({type:"SET_TYPE_ID", payload:e.target.value})} className = "w-1/3 pr-4 pl-15 h-10 text-gray-700 rounded-2xl appearance-none w-full bg-white shadow-sm placeholder-gray-400 focus:shadow-inner text-sm focus:outline-none pl-10">
                        <option className = "rounded-xl" value="" hidden>Тип</option>
                        {state.types?.map(item => (
                            <option key = {item.id} value = {item.id}>{item.name}</option>
                        ))}
                    </select>
                </div>
                <div className = "pl-3">
                    <label className = "pl-4">Введите начальное число</label>
                    <input onChange={(e)=>{setState({type:"SET_START_DATE", payload:e.target.value})}} type = "text" onFocus = {(e)=>{e.currentTarget.type="date"}} onBlur={(e)=>e.currentTarget.type="text"}  placeholder = "Введите начальное число" className = "w-1/3 pr-4 pl-15 h-10 text-gray-700 rounded-2xl appearance-none w-full bg-white shadow-sm placeholder-gray-400 focus:shadow-inner text-sm focus:outline-none pl-10"/>        
                </div>
                <div className = "pl-3">
                    <label className = "pl-4">Введите конечное число</label>
                    <input onChange={(e)=>{setState({type:"SET_END_DATE", payload:e.target.value})}} type = "text" onFocus = {(e)=>{e.currentTarget.type="date"}} onBlur={(e)=>e.currentTarget.type="text"}  placeholder = "Введите начальное число" className = "w-1/3 pr-4 pl-15 h-10 text-gray-700 rounded-2xl appearance-none w-full bg-white shadow-sm placeholder-gray-400 focus:shadow-inner text-sm focus:outline-none pl-10"/>
                </div>
            </div>
            { !state.loading &&
            <div className = "flex flex-col justify-center items-center">
            <LineChart className = "p-3" width={1000} height={250} data={state.price_data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="created_at" />
                            <YAxis />
                        <Tooltip />
                    <Legend />  
                <Line  type="monotone" dataKey="Продажа" stroke="#8884d8" />
                <Line type="monotone" dataKey="Аренда" stroke="#82ca9d" />
            </LineChart>

            <AreaChart className = "py-5 pl-2" width={1000} height={250} data={state.estate_chart}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorKv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fc4103" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#fc4103" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorZv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#03fcf4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#03fcf4" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="created_at" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="На продаже" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
                <Area type="monotone" dataKey="Проданные" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
                <Area type="monotone" dataKey="Сдается в аренду" stroke="#fc4103" fillOpacity={1} fill="url(#colorKv)" />
                <Area type="monotone" dataKey="Сдано в аренду" stroke="#03fcf4" fillOpacity={1} fill="url(#colorZv)" />
            </AreaChart>

            <div className = "flex flex-row justify-center items-center p-5">
                <div className = "" style = {{color:"#8884d8"}}>На продаже</div>
                <div className = "pl-3" style = {{color:"#82ca9d"}}>Проданные</div>
                <div className = "pl-3" style = {{color:"#fc4103"}}>Сдается в аренду</div>
                <div className = "pl-3" style = {{color:"#03fcf4"}}>Сдано в аренду</div>
            </div>
            <div className="flex flex-col p-7 justify-center items-center">
                <div>
                    <p className=" text text-xl pb-5 justify-center items-center">Статистика VIP</p>
                </div>
            <AreaChart className = "py-5 pl-2" width={1000} height={250} data={state.vips}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                    {/* <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorKv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fc4103" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#fc4103" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorZv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#03fcf4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#03fcf4" stopOpacity={0}/>
                    </linearGradient> */}
                </defs>
                <XAxis dataKey="created_at" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="Количество VIP" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
                {/* <Area type="monotone" dataKey="Проданные" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" /> */}
                {/* <Area type="monotone" dataKey="Сдается в аренду" stroke="#fc4103" fillOpacity={1} fill="url(#colorKv)" /> */}
                {/* <Area type="monotone" dataKey="Сдано в аренду" stroke="#03fcf4" fillOpacity={1} fill="url(#colorZv)" /> */}
            </AreaChart>
            </div>
            <BarChart width={1000} height={250} data={state.user_chart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="created_at" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Собственники" fill="#8884d8" />
                <Bar dataKey="Риелторы" fill="#82ca9d" />
            </BarChart>
                <div className="flex flex-row p-5">
                <div className = "pl-3">
                    <label className = "pl-4">Выберите регион</label>
                    <select onChange = {(e)=>setState({type:"SET_LOCATION_ID", payload:e.target.value})} className = "w-1/3 pr-4 pl-15 h-10 text-gray-700 rounded-2xl appearance-none w-full bg-white shadow-sm placeholder-gray-400 focus:shadow-inner text-sm focus:outline-none pl-10">
                        <option className = "rounded-xl" value="" hidden>Регион</option>
                        {state.locations?.map(item => (
                            <option key = {item.value} value = {item.value}>{item.label}</option>
                        ))}
                    </select>
                </div>
                </div>
            <BarChart width={1000} height={250} data={state.loaction_stat}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="translation" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Количество" fill="#86de3a" />
                {/* <Bar dataKey="Риелторы" fill="#82ca9d" /> */}
            </BarChart>
                </div>
            }
            </>
            }
        </div>
    )
};

export default Analytics;