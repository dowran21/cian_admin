import {useReducer, useEffect} from 'react';
import {AiOutlineReload} from "@react-icons/all-files/ai/AiOutlineReload";
import {BiEdit} from "@react-icons/all-files/bi/BiEdit";
import {TiArrowSortedUp} from "@react-icons/all-files/ti/TiArrowSortedUp";
import SearchInput from '../../components/SearchInput';
import MyPagination from '../../components/Pagination';
import IconButton from "../../components/IconButton";
import Layout from "../../components/Layout";
import Table from '../../components/Table/Table';
import Head from '../../components/Table/Head';
import Body from '../../components/Table/Body';
import Row from '../../components/Table/Row';
import Cell from '../../components/Table/Cell';
import NoContent from '../../components/NoContent';
import { BiTrash } from "@react-icons/all-files/bi/BiTrash";
import {useDispatch, useSelector} from 'react-redux'
import { get } from '../../application/middlewares';
import toast from 'react-hot-toast';
import Form from './Form';
import BgLoader from '../../components/BgLoader';
import {RiVipCrown2Line} from "@react-icons/all-files/ri/RiVipCrown2Line"
import {BiArrowToTop} from "@react-icons/all-files/bi/BiArrowToTop"
import {IoIosNotificationsOutline} from "@react-icons/all-files/io/IoIosNotificationsOutline"
import ReactSelect from "react-select"
import makeAnimated from 'react-select/animated';
const animatedComponents = makeAnimated();

function reducer(state, action) {
    switch (action.type) {
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            }
        case 'SET_LIMIT':
            return{
                ...state,
                limit:action.payload,
                page:0,
                trigger:!state.trigger,
            }
        case 'SET_PAGE':
            return{
                ...state,
                page:action.payload,
                trigger:!state.trigger,
            }
        case 'SET_DATA':
            return{
                ...state, loading:false, count:+action.payload.count ? +action.payload.count : 0, data:action.payload.data
            }
        case 'SET_TRIGGER':
            return{
                ...state, trigger:!state.trigger
            }
        case 'SET_SORT':
            return{
                ...state,
                sort_column: action.payload.column,
                sort_direction: action.payload.direction,
                page:0,
                trigger:!state.trigger,
            }
        case 'SET_SEARCH':
            return{
                ...state,
                search:action.payload,
                trigger:!state.trigger,
            }
        case 'SET_CLOSE_MODAL':{
            return{
                ...state,
                values:{},
                visible:false
            }
        }
        case 'SET_VISIBLE_FORM':{
            return{
                ...state,
                values:action.payload,
                visible:true,
                form:"watch"
            }
        }
        case 'SET_SUBMIT_DATA':{
            return{
                ...state,
                data:state.data?.filter(item => item.id !== action.payload.id),
                count:state.count - 1,
                values:{},
                visible:false
            }
        }
        case "SET_IS_ACTIVE":
            return {
                ...state,
                is_active:action.payload,
                trigger:!state.trigger
            }
        case "SET_VIP_FORM":
            return {
                ...state,
                form:"VIP",
                values:action.payload,
                visible:true
            }
        case "SET_TOP_FORM":
            return {
                ...state,
                form:"TOP",
                values:action.payload,
                visible:true
            }
        case "SET_VISIBLE_PUSH_FORM":
            return {
                ...state,
                form:"PUSH",
                values:action.payload,
                visible:true
            }
        case "SET_VISIBLE_REMOVE_FORM":
            return {
                ...state,
                form:"remove",
                values:action.payload,
                visible:true
            }
        case "SET_SUBMIT_VIP":
            return {
                ...state,
                data:state.data.map(item => {
                    if(item.id === action.payload.real_estate_id){
                        item.vip_id = action.payload.id;
                        item.vip_lower_date = action.payload.vip_lower_date;
                        item.vip_upper_date = action.payload.vip_upper_date;
                        item.vip_type_id = action.payload.vip_type_id;
                    }return item;
                })
            }
        case "SET_LOCATIONS":
            return {
                ...state,
                locations:action.payload
            }
        case "SET_TYPES":
            return {
                ...state,
                types:action.payload
            }
        case "REMOVE_ESTATE":
            return{
                ...state,
                data:state.data.filter(item => item.id !== action.payload),
                visible:false
            }
        case "SET_SELECTED_LOCATION":
            return {
                ...state,
                location_id:action.payload,
                trigger:!state.trigger,
                page:0,
                loading:true
            }
        case "SET_SELECTED_TYPE":
            return {
                ...state,
                type_id:action.payload,
                trigger:!state.trigger,
                page:0,
                loading:true
            }
        case "SET_SELECTED_CATEGORY":
            return {
                ...state,
                category_id:action.payload,
                trigger:!state.trigger,
                page:0,
                loading:true
            }
        case "SET_SUB_LOCATIONS":
            return {
                ...state,
                sub_locations:action.payload
            }
        case "SET_VIP_SEARCH":
            return {
                ...state,
                vip:action.payload,
                page:0,
                trigger:!state.trigger,
                loading:true
            }
        default: return state;
    }
}

function RealEstates(){
    const [state, setState] = useReducer(reducer, {
        loading: false, limit:30, count:0, page:0, data:[],
        sort_direction:'DESC', sort_column:'', trigger:false,
        search:'', visible:false, values:{}, is_active:"", form:"", types:[], locations:[],
        location_id:"", type_id:"", category_id:"",
        sub_locations:[], vip:""
    });
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const token = useSelector(state => state.auth.token);
    useEffect(()=>{
        dispatch(get({
            url:`api/admin/locations-for-select`,
            token,
            action: (response) =>{
                if(response.success){
                    console.log(response.data, "----locations for select")
                    setState({type:"SET_LOCATIONS", payload:response.data.rows})
                }else{
                    console.log(response)
                    toast.error("Неизвестная ошибка при гет запросе locatins")
                }
            }
        }))
    }, [])
    useEffect(()=>{
        dispatch(get({
            url:`api/admin/types-for-select`,
            token,
            action: (response) =>{
                if(response.success){
                    setState({type:"SET_TYPES", payload:response.data.rows})
                }else{
                    console.log(response)
                    toast.error("Неизвестная ошибка при гет запросе types")
                }
            }
        }))
    }, [])
    useEffect(() => {
        setState({type:'SET_LOADING', payload:true});
        dispatch(get({
            url:`/api/admin/get-confirm-real-estates/?page=${state.page}&limit=${state.limit}&sort_direction=${state?.sort_direction}&sort_column=${state?.sort_column}&search=${state.search}&is_active=${state.is_active}&location_id=${state.location_id}&type_id=${state.type_id}&category_id=${state.category_id}&vip=${state.vip}`,
            token,
            action:(response) =>{
                if(response.success){
                    console.log(response.data)
                    setState({type:'SET_DATA', payload:{count: +response.data?.count, data:response.data?.real_estates?.length > 0 ? response.data?.real_estates : []}})
                }else{
                    setState({type:'SET_LOADING', payload:false});
                    toast.error('Неизвестная ошибка')
                }
            }
        }));// eslint-disable-next-line
    }, [state.trigger]);

    const handleSort = (column) => {
        if (state.sort_column === column) {
            if (state.sort_direction === 'ASC') {
                setState({type:'SET_SORT', payload: {direction: 'DESC', column} });
            } else {
                setState({ type:'SET_SORT', payload: {direction: 'ASC', column} });
            }
        } else {
            setState({type:'SET_SORT', payload: {direction: 'DESC', column} });
        }
    }

    const handleSearch = (value) => {
        setState({type:'SET_SEARCH', payload:value})
    }
    useEffect(()=>{
        if(state.location_id){
            dispatch(get({
                url:`api/admin/get-sub-locatins/${state.location_id}`,
                token,
                action : (response) =>{
                    if(response.success){
                        console.log(response.data.rows)
                        if(response.data.rows?.length){
                            setState({type:"SET_SUB_LOCATIONS", payload:response.data.rows})
                        }
                    }
                }
            }))
        }

    }, [state.location_id])
    // onClick={() => handleSort('re.id')}
    return(
        <Layout 
            header={<Header handleSearch={handleSearch} 
                handleClick={() =>setState({type:'SET_TRIGGER'})}
                locations = {state.locations}
                types = {state.types}
                setLocation = {(value) =>setState({type:"SET_SELECTED_LOCATION", payload:value?.value ? value?.value : "" })}
                setType = {(value) => setState({type:"SET_SELECTED_TYPE", payload:value?.value ? value?.value : ""})}
                setCategory = {(value) => setState({type:"SET_SELECTED_CATEGORY", payload:value?.value ? value?.value : ""})}
                subLocations = {state.sub_locations}
                setVip = {(value) => setState({type:"SET_VIP_SEARCH", payload:value?.value ? value.value : ""})}
                />
                
            } 
            footer={<MyPagination setPage={(value) => setState({type:'SET_PAGE', payload:value})} limit={+state.limit} count={+state.count} page={state.page} setLimit={(value) => setState({type:'SET_LIMIT', payload:value})}/>}>
            <Form  
                token={token} 
                values={state.values} 
                visible={state.visible} 
                setSubmitData={(data) => setState({type:'SET_SUBMIT_DATA', payload:data})}  
                setCloseModal={() => setState({type:'SET_CLOSE_MODAL'})}
                setSubmitVip = {(values) => setState({type:"SET_SUBMIT_VIP", payload:values})}
                form = {state.form}
                setRemovedEstate = {(value)=> setState({type:"REMOVE_ESTATE", payload:value})}
            />
            <BgLoader loading={state.loading}/>
            <div className="flex flex-row justify-start items-start bg-blue-50 h-12 ">
                    <button onClick={() => setState({type:'SET_IS_ACTIVE', payload:""})}  className={`${state.is_active === ""? 'bg-white' : ''} flex justify-center items-center min-w-200 whitespace-nowrap px-3 h-full rounded-t-lg focus:outline-none`}>
                        Ожидающие
                    </button>  
                    <button onClick={() => setState({type:'SET_IS_ACTIVE', payload:false})}  className={`${state.is_active === false ? 'bg-white' : ''} flex justify-center items-center min-w-200 whitespace-nowrap px-3 h-full rounded-t-lg focus:outline-none`}>
                        Отказанные
                    </button>
                    <button onClick={() => setState({type:'SET_IS_ACTIVE', payload:true})}  className={`${state.is_active === true ? 'bg-white' : ''} flex justify-center items-center min-w-200 whitespace-nowrap px-3 h-full rounded-t-lg focus:outline-none`}>
                            Подтвержденные
                        </button>   
                    { user?.role_id === 1 &&
                        <button onClick={() => setState({type:'SET_IS_ACTIVE', payload:"all"})}  className={`${state.is_active === "all" ? 'bg-white' : ''} flex justify-center items-center min-w-200 whitespace-nowrap px-3 h-full rounded-t-lg focus:outline-none`}>
                            Все
                        </button> 
                    }
            </div>
            <>
            <div className="w-full paddd px-6 overflow-x-auto overflow-x-scroll  overflow-y-auto">
                <Table>
                    <Head>
                        <Row>
                            <>
                            <Cell>
                                <div  className={`${state.sort_column === 're.id' ? 'text-blue-500' : ''} px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer`}>
                                    <span>ID</span>
                                    {/* <TiArrowSortedUp className={`${state.sort_direction === 'ASC' && state.sort_column === 're.id' ? '' : 'rotate-180'} text-xl mt-1 ml-2 transform duration-300 ease-in-out`}/> */}
                                </div>
                            </Cell>
                            <Cell>
                                <div  className={`${state.sort_column === 'full_name' ? 'text-blue-500' : ''} px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer`}>
                                    <span>Пользователь</span>
                                    {/* <TiArrowSortedUp className={`${state.sort_direction === 'ASC' && state.sort_column === 'full_name' ? '' : 'rotate-180'} text-xl mt-1 ml-2 transform duration-300 ease-in-out`}/> */}
                                </div>
                            </Cell>
                            <Cell>
                                <div  className={`${state.sort_column === 'phone' ? 'text-blue-500' : ''} px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer`}>
                                    <span>Номер телефона</span>
                                    {/* <TiArrowSortedUp className={`${state.sort_direction === 'ASC' && state.sort_column === 'phone' ? '' : 'rotate-180'} text-xl mt-1 ml-2 transform duration-300 ease-in-out`}/> */}
                                </div>
                            </Cell>
                            <Cell>
                                <div className="px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer">
                                    <span>Тип пользователя</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div  className={`${state.sort_column === 'real_estate_name' ? 'text-blue-500' : ''} px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer`}>
                                    <span>Недвижимость</span>
                                    {/* <TiArrowSortedUp className={`${state.sort_direction === 'ASC' && state.sort_column === 'real_estate_name' ? '' : 'rotate-180'} text-xl mt-1 ml-2 transform duration-300 ease-in-out`}/> */}
                                </div>
                            </Cell>
                            <Cell>
                                <div className={`${state.sort_column === 'location' ? 'text-blue-500' : ''} px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer`}>
                                    <span>Местоположение</span>
                                    {/* <TiArrowSortedUp className={`${state.sort_direction === 'ASC' && state.sort_column === 'location' ? '' : 'rotate-180'} text-xl mt-1 ml-2 transform duration-300 ease-in-out`}/> */}
                                </div>
                            </Cell>
                            <Cell>
                                <div  className={`${state.sort_column === 'price' ? 'text-blue-500' : ''} px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer`}>
                                    {/* <TiArrowSortedUp className={`${state.sort_direction === 'ASC' && state.sort_column === 'price' ? '' : 'rotate-180'} text-xl mt-1 ml-2 transform duration-300 ease-in-out`}/> */}
                                    <span>Цена</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div  className={`px-2 py-4 font-medium flex flex-row justify-start items-center `} >
                                    <span>{state.is_active===null ? "Добавлено" : state.is_active ===true ? "Подтверждено" : state.is_active === "all" ? "Добавлено" : "Отказано" }</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div  className={`px-2 py-4 font-medium flex flex-row justify-start items-center `} >
                                    <span>VIP</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div className="px-2 py-4 font-medium text-center">
                                    Действия
                                </div>
                            </Cell>
                            </>
                        </Row>
                    </Head>
                    <Body>
                    { state.data?.length > 0 ?
                       state.data?.map(item =>(
                        <Row key={item.id}>
                            <>
                            <Cell>
                                <div className="p-2">
                                    {item?.id}
                                </div>
                            </Cell>
                            <Cell>
                                <div className="p-2">
                                    {item?.full_name}
                                </div>
                            </Cell>
                            <Cell>
                                <div className="p-2">
                                +993 {item?.phone.substring(0, 2)} {item?.phone.substring(2, )}
                                </div>
                            </Cell>
                            <Cell>
                                <div className="p-2">
                                    {item?.type_of_owner}
                                </div>
                            </Cell>
                            <Cell>
                                <div className="p-2">
                                    {item?.real_estate_name}
                                </div>
                            </Cell>
                            <Cell>
                                <div className="p-2">
                                    {item?.location}
                                </div>
                            </Cell>
                            <Cell>
                                <div className="p-2 w-28">
                                    {item?.price} TMT
                                </div>
                            </Cell>
                            <Cell>
                                <div className="p-2">
                                    {state.is_active === "all" ? `${item.created_at}` :item?.logged_time ? `${item.logged_time}` : `${item.created_at}`}
                                </div>
                            </Cell>
                            <Cell>
                                <div className="p-2 w-32">
                                    {item.vip_id ? 
                                        <>
                                        <p>{item.vip_type_id === 1 ? `VIP` : `TOP`}</p>
                                        <p>от {item.vip_lower_date}</p> 
                                        <p>до {item.vip_upper_date}</p>
                                        </>
                                    :
                                    <div>
                                        Нет VIP 
                                    </div>
                                    }
                                </div>
                            </Cell>
                            <Cell>
                                <div className="flex flex-col py-2 flex justify-center">
                                    <div className='flex flex-row py-1 justify-center items-center'>
                                        {!item.vip_id &&
                                            <>
                                                <IconButton tooltip = "Добавить в TOP" handleClick={() => setState({type:'SET_TOP_FORM', payload:{id:item?.id}})} icon={<BiArrowToTop className="text-2xl"/>}/>
                                                <IconButton tooltip = "Добавить в VIP" handleClick={() => setState({type:'SET_VIP_FORM', payload:{id:item?.id}})} icon={<RiVipCrown2Line className="text-2xl"/>}/>
                                            </>
                                        }   
                                    </div>
                                    <div className='flex flex-row justify-center items-center'>
                                        <IconButton tooltip = "Убрать объвление" handleClick={() => setState({type:'SET_VISIBLE_REMOVE_FORM', payload:{id:item?.id}})} icon={<BiTrash className="text-2xl"/>}/>
                                        <IconButton tooltip = "Добавить в PUSH" handleClick={() => setState({type:'SET_VISIBLE_PUSH_FORM', payload:{id:item?.id}})} icon={<IoIosNotificationsOutline className="text-2xl"/>}/>
                                        <IconButton tooltip = "Просмотреть" handleClick={() => setState({type:'SET_VISIBLE_FORM', payload:{id:item?.id}})} icon={<BiEdit className="text-2xl"/>}/>
                                    </div>
                                    
                                </div>
                            </Cell>
                            </>
                        </Row>
                    ))
                    :
                    state.loading === true ? null :
                        <tr>
                            <td colSpan="10" >
                                <div className="flex w-full h-full py-20 justify-center items-center">
                                    <NoContent title="Нет недвижимости"/>
                                </div>
                            </td>
                        </tr>
                    }
                    </Body>
                </Table>
                
            </div>
            </>

        </Layout>
    )
};
const stylesWidth = {
    control: css => ({
        ...css,
        width: 225,
    }),
    menu: ({ width, ...css }) => ({
        ...css,
        width: '225px',
        minWidth: '20%',
    }),
    option: css => ({ ...css}),
};
const Header = ({handleSearch, handleClick,setVip, setLocation, locations, types, setType, setCategory, subLocations}) =>(
    <div className="flex flex-row justify-between items-center pb-4">
        {/* <IconButton tooltip = "Обновить" handleClick={handleClick} icon={<AiOutlineReload className="text-2xl "/>}/> */}
        <div className="flex flex-col  relative px-2  ">
            <ReactSelect 
                styles = {stylesWidth}
                className = "w-68 min-w-max"
                isSearchable = {false}
                closeMenuOnSelect = {true}
                components = {animatedComponents}
                isClearable = {true}
                placeholder = {"Выберите регион"}
                onChange = {setLocation}
                options = {locations}
            />
        </div>
        <div className="flex flex-col  relative px-2 ">
            <ReactSelect 
                styles = {stylesWidth}
                className = "w-68 min-w-max"
                isSearchable = {true}
                closeMenuOnSelect = {true}
                components = {animatedComponents}
                isClearable = {true}
                placeholder = {"Выберите район"}
                onChange = {setLocation}
                options = {subLocations}
            />
        </div>
        <div className="flex flex-col  relative px-2  ">
            <ReactSelect 
                styles = {stylesWidth}
                className = "w-68 min-w-max"
                isSearchable = {false}
                closeMenuOnSelect = {true}
                components = {animatedComponents}
                isClearable = {true}
                placeholder = {"Тип недвижимости"}
                onChange = {setType}
                options = {types}
            />
        </div>
        <div className="flex flex-col  relative px-2  ">
            <ReactSelect 
                styles = {stylesWidth}
                className = "w-68 min-w-max"
                isSearchable = {false}
                closeMenuOnSelect = {true}
                components = {animatedComponents}
                isClearable = {true}
                placeholder = {"Тип сделки"}
                onChange = {setCategory}
                options = {[{value:1, label:"Продается"}, {value:2, label:"Сдаеться в аренду"}]}
            />
        </div>
        <div className="flex flex-col  relative px-2  ">
            <ReactSelect 
                styles = {stylesWidth}
                className = "w-68 min-w-max"
                isSearchable = {false}
                closeMenuOnSelect = {true}
                components = {animatedComponents}
                isClearable = {true}
                placeholder = {"VIP"}
                onChange = {setVip}
                options = {[{value:"", label:"Все"}, {value:"true", label:"Только VIP"}, {value:"false", label:"Только не VIP"}]}
            />
        </div>
        <div className="w-80">
            <SearchInput action={(value) => handleSearch(value)} placeholder="Поиск"/>
        </div>
    </div>
);

export default RealEstates;