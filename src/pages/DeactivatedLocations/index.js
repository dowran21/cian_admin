import {useReducer, useEffect} from 'react';
import {IoMdAdd} from "@react-icons/all-files/io/IoMdAdd";
import {BiEdit} from "@react-icons/all-files/bi/BiEdit";
import IconButton from "../../components/IconButton";
import Layout from "../../components/Layout";
import Table from '../../components/Table/Table';
import Head from '../../components/Table/Head';
import Body from '../../components/Table/Body';
import Row from '../../components/Table/Row';
import Cell from '../../components/Table/Cell';
import NoContent from '../../components/NoContent';
import {useDispatch, useSelector} from 'react-redux'
import { get, post } from '../../application/middlewares';
import toast from 'react-hot-toast';
import Form from './Form';
import BgLoader from '../../components/BgLoader';
import Switch from 'react-switch'

function reducer(state, action) {
    console.log(action)
    switch (action.type) {
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            }
        case 'SET_MAIN_LOCATIONS':
            return{
                ...state,
                main_locations: action.payload.data,
                main: action.payload?.data?.[0]
            }
        case 'SET_MAIN':
            return{
                ...state,
                main:action.payload
            }
        case 'SET_DATA':
            return{
                ...state, loading:false, data:action.payload.data
            }
        case 'SET_SEARCH':
            return{
                ...state,
                search:action.payload,
                trigger:!state.trigger,
            }
        case 'SET_STATUS':{
            return{
                ...state,
                data:state.data.map(item => {
                    if(item.id === action.payload.id){
                        return {...item, enabled: action.payload.enabled}
                    }return item;
                })
            }
        }
        case 'SET_VISIBLE_MAIN_CREATE_FORM':{
            return{
                ...state,
                values:{enabled:true},
                visible:true,
                form:'create_main_form',
            }
        }
        case 'ADD_MAIN_LOCATION':{
            return{
                ...state,
                main_locations:state.main_locations.concat(action.payload),
                visible:false,
                values:{},
                form:'',
            }
        }
        case 'SET_VISIBLE_MAIN_UPDATE_FORM':{
            return{
                ...state,
                values:state.main,
                visible:true,
                form:'update_main_form'
            }
        }
        case 'UPDATE_MAIN_LOCATION':{
            return{
                ...state,
                main_locations:state.main_locations.map(item => {
                    
                    if(+item.id === +action.payload.id){
                        console.log(action.payload, '----')
                        return action.payload
                    }return item;
                }),
                main: +state.main.id === +action.payload.id ? action.payload : state.main,
                visible:false,
                values:{},
                form:'',
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
        case 'SET_VISIBLE_CREATE_FORM':{
            return{
                ...state,
                values:{main_location_id:state.main.id},
                visible:true,
                form:'create',
            }
        }
        case 'SET_VISIBLE_UPDATE_FORM':{
            return{
                ...state,
                values:action.payload,
                visible:true,
                form:'update',
            }
        }
        case 'ADD_LOCATION':{
            console.log(action.payload)
            return{
                ...state,
                data:state.data.concat(action.payload),
                visible:false,
                values:{},
                form:'',
            }
        }
        case 'UPDATE_LOCATION':{
            return{
                ...state,
                data: state.data.map(item => {
                    if(+item.id === +action.payload.id){
                        return action.payload
                    }return item;
                }),
                visible:false,
                values:{},
                form:'',
            }
        }
        default: return state;
    }
}

function DeactivatedLocations(){
    const [state, setState] = useReducer(reducer, {
        loading: false, data:[], main_locations:[], main:{id:0, name:''}, trigger:false,
        search:'', visible:false, values:{}, form:''
    });
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    useEffect(() => {
        setState({type:'SET_LOADING', payload:true});
        dispatch(get({
            url:`/api/admin/main-locations`,
            token,
            action:(response) =>{
                // console.log(response)
                if(response.success){
                    setState({type:'SET_MAIN_LOCATIONS', payload:{data:response.data?.rows?.length > 0 ? response.data?.rows : []}})
                }else{
                    setState({type:'SET_LOADING', payload:false});
                    toast.error('Неизвестная ошибка')
                }
            }
        }));// eslint-disable-next-line
    }, []);

    useEffect(() => {
        if(state.main.id > 0){
            setState({type:'SET_LOADING', payload:true});
            dispatch(get({
                url:`api/admin/get-deleted-regions/${state.main.id}`,
                token,
                action:(response) =>{
                    console.log(response)
                    if(response.success){
                        setState({type:'SET_DATA', payload:{data:response.data?.rows?.length > 0 ? response.data?.rows : []}})
                    }else{
                        setState({type:'SET_LOADING', payload:false});
                        toast.error('Неизвестная ошибка')
                    }
                }
            }));
        }// eslint-disable-next-line
    }, [state.main.id, state.trigger]);

    const handleSearch = (value) => {
        setState({type:'SET_SEARCH', payload:value})
    }

    const activate_location = (id) =>{
        setState({type:'SET_LOADING', payload:true});
        dispatch(post({
            url: `api/admin/activate-location/${id}`,
            token,
            action:(response) =>{
                console.log(response);
                if(response.success){
                    setState({type:'SET_DATA', payload:{data:state.data.filter(item => item.id !== id)}})
                }else{
                    setState({type:'SET_LOADING', payload:false});
                    toast.error('Неизвестная ошибка')
                }
            }
        }))
    }

    return(
        <Layout header={<Header handleSearch={handleSearch} handleClick={() => setState({type:'SET_VISIBLE_MAIN_CREATE_FORM'})}/>}>
            <Form  
                form={state.form}
                token={token} 
                values={state.values} 
                visible={state.visible} 
                addLocation={(value) => setState({type:'ADD_LOCATION', payload:value})} 
                updateLocation={(value) => setState({type:'UPDATE_LOCATION', payload:value})}
                updateMainLocation={(value) => setState({type:'UPDATE_MAIN_LOCATION', payload:value})} 
                addMainLocation={(value) => setState({type:'ADD_MAIN_LOCATION', payload:value})} 
                setCloseModal={() => setState({type:'SET_CLOSE_MODAL'})}
            />
            <BgLoader loading={state.loading}/>
            <div className="flex flex-row justify-start items-start bg-blue-50 w-full h-12 overflow-x-auto">
                {state.main_locations.map(item =>
                    <button onClick={() => setState({type:'SET_MAIN', payload:item})} key={item.id} className={`${item.id === state.main.id ? 'bg-white' : ''} flex justify-center items-center min-w-200 whitespace-nowrap px-3 h-full rounded-t-lg focus:outline-none`}>
                        {item.name_ru}
                    </button>  
                )}
            </div>
            <div className="w-full h-16 flex flex-row justify-between items-center">
                <div></div>
                <div className="font-semibold text-lg ml-24">
                    {state.main.name_ru}
                </div>
                {/* <div className="flex flex-row">
                    <IconButton tooltip = "Изменить" handleClick={() => setState({type:'SET_VISIBLE_MAIN_UPDATE_FORM'})} icon={<BiEdit className="text-2xl"/>}/>
                    <IconButton tooltip = "Добавить" handleClick={() => setState({type:'SET_VISIBLE_CREATE_FORM'})} icon={<IoMdAdd className="text-2xl "/>}/>
                </div> */}
            </div>
            <div className="w-full h-full px-6 overflow-y-auto pb-14">
                <Table>
                    <Head>
                        <Row>
                            <>
                            <Cell>
                                <div className={`${state.sort_column === 'id' ? 'text-blue-500' : ''} px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer`}>
                                    <span>ID</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div className={`${state.sort_column === 'full_name' ? 'text-blue-500' : ''} px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer`}>
                                    <span>На туркменском</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div className="px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer">
                                    <span>На русском</span>
                                </div>
                            </Cell>

                            <Cell>
                                <div className={`${state.sort_column === 'deleted' ? 'text-blue-500' : ''} px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer`}>
                                    <span>Статус</span>
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
                                    
                                    {item?.name_tm}
                                </div>
                            </Cell>
                            <Cell>
                                <div className="p-2">
                                {item?.name_ru}
                                </div>
                            </Cell>
                            <Cell>
                                <div className="p-2">
                                    {/* <Switcher item_id={item.id} status={item?.enabled} handleStatus={handleStatus}/> */}
                                    <Switch onColor="#34D399" checked = "" checkedIcon = "" width={37} height={18} onChange = {()=>activate_location(item.id)}  />
                                </div>
                            </Cell>
                            <Cell>
                                <div className="p-2 flex justify-center">
                                    {/* <IconButton handleClick={() => setState({type:'SET_VISIBLE_UPDATE_FORM', payload:{id:item.id, name_tm:item.name_tm, name_ru:item.name_ru, enabled:item.enabled, main_location_id:state.main.id}})} icon={<BiEdit className="text-2xl"/>}/> */}
                                    {item?.comment}
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
                                    <NoContent title="Нет Локаций"/>
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

const Header = ({handleSearch, handleClick}) =>(
    <div className="flex flex-row justify-between items-center">
        <div className = "flex flex-row justify-center items-start"> 
            {/* <div>
                <IconButton handleClick={handleClick} icon={<IoMdAdd className="text-3xl "/>}/>
            </div> */}
        </div>
    </div>
);

export default DeactivatedLocations;