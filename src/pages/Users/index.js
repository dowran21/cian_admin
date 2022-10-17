import {useReducer, useEffect} from 'react';
import {TiArrowSortedUp} from "@react-icons/all-files/ti/TiArrowSortedUp";
import SearchInput from '../../components/SearchInput';
import MyPagination from '../../components/Pagination';
import Layout from "../../components/Layout";
import Table from '../../components/Table/Table';
import Head from '../../components/Table/Head';
import Body from '../../components/Table/Body';
import Row from '../../components/Table/Row';
import Cell from '../../components/Table/Cell';
import Switcher from '../../components/Switcher';
import NoContent from '../../components/NoContent';
import {useDispatch, useSelector} from 'react-redux'
import { get, post } from '../../application/middlewares';
import toast from 'react-hot-toast';
import Form from './Form';
import BgLoader from '../../components/BgLoader';
import Switch from 'react-switch';
import IconButton from '../../components/IconButton'
import {BiTrash} from "@react-icons/all-files/bi/BiTrash"
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
        case 'SET_SORT':
            return{
                ...state,
                sort_column: action.payload.column,
                sort_direction: action.payload.direction,
                page:0,
                loading:true,
                trigger:!state.trigger,
            }
        case 'SET_SEARCH':
            return{
                ...state,
                search:action.payload,
                trigger:!state.trigger,
            }
        case 'SET_PERMISSION':{
            return{
                ...state,
                data:state.data.map(item => {
                     if(item.id === action.payload.id){
                        console.log(action.payload)
                        return {...item, is_active: action.payload.is_active}
                    }return item;
                })
            }
        }
        case 'SET_CLOSE_MODAL':{
            return{
                ...state,
                values:{},
                visible:false,
                form:''
            }
        }
        case 'ADD_PERMISSION':{
            return{
                ...state,
                data:state.data.map(item =>{
                    if (item.id === action.payload.id){
                        return action.payload
                    }return item;
                }),
            }
        }
        case 'SET_PERMISSION_FORM':{
            return{
                ...state,
                values:{"id":action.payload.id},
                visible:true,
                form:'add_permission',
            }
        }
        case "CHANGE_USER_OWNER_TYPE":{
            return {
                ...state,
                data:state.data.map(item => {
                    if(item.id===action.payload.user_id){
                        item.owner_id = action.payload.owner_id
                    }return item
                }),
                loading:false
            }
        }
        case "DELETE_FORM":
            return {
                ...state,
                form:"delete",
                values:action.payload,
                visible:true
            }
        case "DELETE_USER":
            return {
                ...state,
                data:state.data.filter(item => item.id !== action.payload),
                visible:false
            }
        case "CHANGE_USER_ACTIVATION":
            return {
                ...state,
                data:state.data.map(item => {
                    if(item.id === +action.payload){
                        item.active = !item.active
                    }return item;
                })
            }
        case "SET_DEACTIVATION_FORM":
            return {
                ...state,
                form:"deactivation",
                visible:true,
                values:action.payload
            }
        case "SET_DEACTIVATION_COMENT":
            return {
                ...state,
                data:state.data.map(item => {
                    if(item.id === +action.payload.id){
                        item.comment = [{comment:action.payload.comment}];
                        item.active = false
                    }return item;
                })
            }
        case "SET_OWNER_TYPE":
            return {
                ...state,
                owner_id:action.payload,
                trigger:!state.trigger,
                page:0,
                loading:true
            }
        case "SET_ACTIVE_TYPE":
            return {
                ...state,
                active:action.payload,
                trigger:!state.trigger,
                page:0,
                loading:true
            }
        default: return state;
    }
}

function Users(){
    const [state, setState] = useReducer(reducer, {
        loading: false, limit:10, count:0, page:0, data:[],
        sort_direction:'DESC', sort_column:'full_name', trigger:false,
        search:'', visible:false, values:{}, form:'', owner_id:"", active:""
    });
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    
    useEffect(() => {
        setState({type:'SET_LOADING', payload:true});
        dispatch(get({
            url:`/api/admin/get-users?page=${state.page}&limit=${state.limit}&sort_direction=${state?.sort_direction}&sort_column=${state?.sort_column}&search=${state.search}&owner_id=${state.owner_id}&active=${state.active}`,
            token,
            action:(response) =>{
                if(response.success){
                    console.log(response.data)
                    setState({type:'SET_DATA', payload:{count: +response.data?.count, data:response.data?.users?.length > 0 ? response.data?.users : []}})

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


    const handleStatus = ({setLoading, value, item_id }) =>{
        // console.log(value)
        dispatch(post({
            url:`/api/admin/change-user-permission/${item_id}`,
            data:{"is_active":value},
            token,
            action:(response) => {
                if(response.success){
                    setState({type:'SET_PERMISSION', payload:{id:item_id, is_active:value}})
                }else{
                    // console.log(response)
                    toast.error("Неизвестная ошибка")
                }
                setLoading(false);
            }
        }))
    }
    
    const handleStatus2 = ({setLoading, value, item_id}) =>{
        dispatch(post({
            url:`api/admin/change-activation/${item_id}`,
            token,
            data:{is_active:value},
            action: (response) =>{
                if(response.success){
                    setState({type:"CHANGE_USER_ACTIVATION", payload:item_id})
                    setLoading(false)
                }else{
                    toast.error("Неизвестная ошибка")
                    setLoading(false)
                }
            }
        }))
    }
    
    const ChangeUserType = ({owner_id, user_id})=>{
        // console.log("hello change user type")
        setState({type:"SET_LOADING", payload:true})
        dispatch(post({
            url:`/api/admin/change-user-type/${user_id}`,
            data:{owner_id},
            token,
            action:(response) =>{
                if(response.success){
                    setState({type:"CHANGE_USER_OWNER_TYPE", payload:{user_id, owner_id}})
                }else{
                    setState({type:"SET_LOADING", payload:false})
                    toast.error("Неизвестная ошибка")
                }
            }
        }))
    }

    return(
        <Layout 
        header={<Header 
            handleSearch={handleSearch} handleClick={() => setState({type:'SET_VISIBLE_CREATE_FORM'})}
            setOwnerId = {(value)=>setState({type:"SET_OWNER_TYPE", payload:value?.value ? value?.value : ""})}
            setActiveType = {(value)=>setState({type:"SET_ACTIVE_TYPE", payload:value?.value ? value?.value : ""})}
        />} 
        footer={<MyPagination setPage={(value) => setState({type:'SET_PAGE', payload:value})} limit={+state.limit} count={+state.count} page={state.page} setLimit={(value) => setState({type:'SET_LIMIT', payload:value})}/>}>
            <Form  form={state.form} 
                addPermission={(value) => setState({type:'ADD_PERMISSION', payload:value})}     
                token={token} values={state.values} visible={state.visible}     
                setCloseModal={() => setState({type:'SET_CLOSE_MODAL'})}
                deleteUserData = {(value) => setState({type:"DELETE_USER", payload:value})} 
                deactivationUser = {(value) => setState({type:"SET_DEACTIVATION_COMENT", payload:value})}   
            />
            <BgLoader loading={state.loading}/>
            <div className="w-full h-full px-6 overflow-y-auto">
                <Table>
                    <Head>
                        <Row>
                            <>
                            <Cell>
                                <div onClick={() => handleSort('id')} className={`${state.sort_column === 'id' ? 'text-blue-500' : ''} px-2 py-4 font-medium flex flex-row justify-center items-center cursor-pointer`}>
                                    <span>ID</span>
                                    <TiArrowSortedUp className={`${state.sort_direction === 'ASC' && state.sort_column === 'id' ? '' : 'rotate-180'} text-xl mt-1 ml-2 transform duration-300 ease-in-out`}/>
                                </div>
                            </Cell>
                            <Cell>
                                <div onClick={() => handleSort('full_name')} className={`${state.sort_column === 'full_name' ? 'text-blue-500' : ''} px-2 py-4 font-medium flex flex-row justify-center items-center cursor-pointer`}>
                                    <span>Полное Имя</span>
                                    <TiArrowSortedUp className={`${state.sort_direction === 'ASC' && state.sort_column === 'full_name' ? '' : 'rotate-180'} text-xl mt-1 ml-2 transform duration-300 ease-in-out`}/>
                                </div>
                            </Cell>
                            <Cell>
                                <div className="px-2 py-4 font-medium flex flex-row justify-center items-center cursor-pointer">
                                    <span>Телефон</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div onClick={() => handleSort('email')} className={`${state.sort_column === 'email' ? 'text-blue-500' : ''} px-2 py-4 font-medium flex flex-row justify-center items-center cursor-pointer`}>
                                    <span>Электронная почта</span>
                                    <TiArrowSortedUp className={`${state.sort_direction === 'ASC' && state.sort_column === 'email' ? '' : 'rotate-180'} text-xl mt-1 ml-2 transform duration-300 ease-in-out`}/>
                                </div>
                            </Cell>
                            <Cell>
                                <div onClick={() => handleSort('email')} className={`${state.sort_column === 'email' ? 'text-blue-500' : ''} px-2 py-4 font-medium flex flex-row justify-center items-center cursor-pointer`}>
                                    <span>Тип пользоватлея</span>
                                    <TiArrowSortedUp className={`${state.sort_direction === 'ASC' && state.sort_column === 'owner_id' ? '' : 'rotate-180'} text-xl mt-1 ml-2 transform duration-300 ease-in-out`}/>
                                </div>
                            </Cell>
                            <Cell>
                                <div className={`${state.sort_column === 'deleted' ? 'text-blue-500' : ''} px-2 py-4 font-medium flex flex-row justify-center items-center`}>
                                    <span>Разрешение</span>
                                    {/* <TiArrowSortedUp className={`${state.sort_direction === 'ASC' && state.sort_column === 'deleted' ? '' : 'rotate-180'} text-xl mt-1 ml-2 transform duration-300 ease-in-out`}/> */}
                                </div>
                            </Cell>
                            {/* <Cell>
                                <div className="px-2 py-4 font-medium text-center">
                                    Разрешение
                                </div>
                            </Cell> */}
                            <Cell>
                                <div className="px-2 py-4 font-medium text-center">
                                    Активация
                                </div>
                            </Cell>
                            <Cell>
                                <div className="px-2 py-4 font-medium text-center">
                                    Последняя активность
                                </div>
                            </Cell>
                            <Cell>
                                <div className="px-2 py-4 font-medium text-center">
                                    Удалить
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
                                <div className="p-2 flex justify-center items-center">
                                    {item?.id}
                                </div>
                            </Cell>
                            <Cell>
                                <div className="p-2 flex justify-center items-center">
                                    {item?.full_name}
                                </div>
                            </Cell>
                            <Cell>
                                <div className="p-2 flex justify-center items-center">
                                    +993 {item?.phone.substring(0, 2)} {item?.phone.substring(2, )}
                                </div>
                            </Cell>
                            <Cell>
                                <div className="p-2 flex justify-center items-center">
                                    
                                    {item?.email ? `${item.email}`:"Нет почты"}
                                </div>
                            </Cell>
                            <Cell>
                                <div className="p-2 flex justify-center items-center">
                                    <select value = {item.owner_id} onChange = {(e)=>ChangeUserType({owner_id:e.target.value,user_id:item.id })} className = "px-3 py-2 placeholder-gray-400 text-gray-700 dark:text-gray-200  bg-white dark:bg-gray-700 rounded text-sm focus:outline-none  border-0 ring-1 ring-gray-300 dark:ring-gray-800 focus:ring-purple-700 dark:focus:ring-2 dark:focus:ring-gray-600 w-full"  >
                                            <option key = {1} value = {1} >Собственник</option>
                                            <option key = {2} value = {2}>Риелтор</option>
                                    </select>
                                </div>
                            </Cell>
                            <Cell>
                                <div className="p-2 justify-center items-center">
                                    <div className="p-2 flex flex-col justify-center">
                                        {item?.is_active  
                                        ? 
                                            (<div className = "flex flex-col justify-center items-center">
                                                
                                            <Switcher item_id={item.id} status={item?.is_active} handleStatus={handleStatus}/>
                                            <div className="p-2 flex flex-col justify-center items-center">
                                                <p>от {item.low_val?.substring(0, 10)}</p> 
                                                <p>до {item.upper_val?.substring(0, 10)}</p>
                                            </div>
                                            </div>) 
                                        : 
                                        (<div className = " flex justify-center items-center"><Switch onChange = {() => setState({type:'SET_PERMISSION_FORM', payload:{id:item.id}})} checked={false} height={18} width={37}/></div>) }
                                    </div>
                                </div>
                            </Cell>
                            {/* <Cell>
                                <div className="p-2 flex w-72 flex-col justify-center items-center">
                                   {item.is_active? 
                                        <div className="p-2 w-72 flex flex-col justify-center items-center">
                                            <p>от {item.low_val?.substring(0, 10)}</p> 
                                            <p>до {item.upper_val?.substring(0, 10)}</p>
                                        </div>
                                    :
                                    ("Нет разрешения")
                                    }
                                </div>
                            </Cell> */}
                            <Cell>
                                {item.active ? 
                                    (<div className = "w-12 h-12 flex justify-center items-center">
                                        <Switch onChange = {() => setState({type:'SET_DEACTIVATION_FORM', payload:{id:item.id, active:item.active}})} checked={true} height={18} width={37}/>
                                        {/* <p>{item.comment?.map((item, index) => item.comment)}</p> */}
                                    </div>)
                                
                                :
                                    <div>
                                        <Switcher item_id={item.id} status={item?.active} handleStatus={handleStatus2}/>
                                        {item.comment?.map((item, index) => <p className = "break-all">{item.comment}</p>)}
                                    </div>                                 
                                }
                            </Cell>
                            <Cell>
                                <div className="p-2 flex justify-center items-center">
                                    {item.created_at}
                                </div>
                            </Cell>
                            <Cell>
                                <div className="p-2 justify-center items-center">
                                    <IconButton tooltip={`Удалить`} handleClick = {() =>setState({type:"DELETE_FORM", payload:item.id})} icon = {<BiTrash className = "text-2xl"/>}/>
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
                                    <NoContent title="Нет Операторов"/>
                                </div>
                            </td>
                        </tr>
                    }
                    </Body>
                </Table>
                
            </div>
        </Layout>
    )
};

const stylesWidth = {
    control: css => ({
        ...css,
        width: 300,
    }),
    menu: ({ width, ...css }) => ({
        ...css,
        width: '300px',
        minWidth: '20%',
    }),
    option: css => ({ ...css}),
};
const Header = ({handleSearch, setOwnerId, setActiveType}) =>(
    <div className="flex flex-row justify-between items-center">
        <div className="w-80">
            <SearchInput action={(value) => handleSearch(value)} placeholder="Поиск"/>
        </div>
        <div className = "flex flex-row p-3">
            <ReactSelect 
                    styles = {stylesWidth}
                    className = "w-68 min-w-max px-3"
                    isSearchable = {false}
                    closeMenuOnSelect = {true}
                    components = {animatedComponents}
                    isClearable = {true}
                    placeholder = {"Выберите тип пользователя"}
                    onChange = {setOwnerId}
                    options = {[{value:1, label:"Собственник"}, {value:2, label:"Риелтор"}]}
                />
            <ReactSelect 
                    styles = {stylesWidth}
                    className = "w-68 min-w-max px-3"
                    isSearchable = {false}
                    closeMenuOnSelect = {true}
                    components = {animatedComponents}
                    isClearable = {true}
                    placeholder = {"Выберите активность"}
                    onChange = {setActiveType}
                    options = {[{value:false, label:"Неактивные"}, {value:true, label:"Активные"}]}
                />
        </div>
    </div>
);

export default Users;