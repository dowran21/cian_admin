import {useReducer, useEffect} from 'react';
import {IoMdAdd} from "@react-icons/all-files/io/IoMdAdd";
import {BiEdit} from "@react-icons/all-files/bi/BiEdit";
import {RiLockPasswordLine} from "@react-icons/all-files/ri/RiLockPasswordLine";
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
import Switcher from '../../components/Switcher';
import NoContent from '../../components/NoContent';
import {useDispatch, useSelector} from 'react-redux'
import { get, post } from '../../application/middlewares';
import toast from 'react-hot-toast';
import Form from './Form';
import BgLoader from '../../components/BgLoader';
import { TiLocationOutline } from "@react-icons/all-files/ti/TiLocationOutline";



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
                trigger:!state.trigger,
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
                        return {...item, deleted: action.payload.deleted}
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
        case 'SET_VISIBLE_CREATE_FORM':{
            return{
                ...state,
                values:{},
                visible:true,
                form:'create',
            }
        }
        case 'ADD_OPERATOR':{
            return{
                ...state,
                data:state.limit >= state.data.length + 1 ? state.data.concat(action.payload) : state.data,
                count:+state.count + 1,
                visible:false,
                values:{},
                form:'',
            }
        }
        case 'UPDATE_OPERATOR':{
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
        case 'SET_VISIBLE_UPDATE_FORM':{
            return{
                ...state,
                values:action.payload,
                visible:true,
                form:'update',
            }
        }
        case 'SET_VISIBLE_CHANGE_PASSWORD_FORM':{
            return{
                ...state,
                values:action.payload,
                visible:true,
                form:'change_password',
            }
        }
        case 'SET_VISIBLE_ADD_LOCATION_FORM':{
            return{
                ...state,
                values:action.payload,
                visible:true,
                form:'add_location'
            }
        }
        default: return state;
    }
}

function Operators(){
    const [state, setState] = useReducer(reducer, {
        loading: false, limit:10, count:0, page:0, data:[],
        sort_direction:'DESC', sort_column:'full_name', trigger:false,
        search:'', visible:false, values:{}, form:''
    });
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    useEffect(() => {
        setState({type:'SET_LOADING', payload:true});
        dispatch(get({
            url:`/api/admin/get-all-operators/?page=${state.page}&limit=${state.limit}&sort_direction=${state?.sort_direction}&sort_column=${state?.sort_column}&search=${state.search}`,
            token,
            action:(response) =>{
                if(response.success){
                    setState({type:'SET_DATA', payload:{count: +response.data?.count, data:response.data?.operators?.length > 0 ? response.data?.operators : []}})
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
        dispatch(post({
            url:`/api/admin/delete-operator/${item_id}`,
            data:{deleted:!value},
            token,
            action:(response) => {
                if(response.success){
                    setState({type:'SET_STATUS', payload:{id:item_id, deleted:!value}})
                }else{
                    console.log(response)
                }
                setLoading(false);
            }
        }))
    }
    return(
        <Layout header={<Header handleSearch={handleSearch} handleClick={() => setState({type:'SET_VISIBLE_CREATE_FORM'})}/>} footer={<MyPagination setPage={(value) => setState({type:'SET_PAGE', payload:value})} limit={+state.limit} count={+state.count} page={state.page} setLimit={(value) => setState({type:'SET_LIMIT', payload:value})}/>}>
            <Form  form={state.form} addOperator={(value) => setState({type:'ADD_OPERATOR', payload:value})} updateOperator={(value) => setState({type:'UPDATE_OPERATOR', payload:value})} token={token} values={state.values} visible={state.visible} setCloseModal={() => setState({type:'SET_CLOSE_MODAL'})}/>
            <BgLoader loading={state.loading}/>
            <div className="w-full h-full px-6 overflow-y-auto">
                <Table>
                    <Head>
                        <Row>
                            <>
                            <Cell>
                                <div onClick={() => handleSort('id')} className={`${state.sort_column === 'u.id' ? 'text-blue-500' : ''} px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer`}>
                                    <span>ID</span>
                                    <TiArrowSortedUp className={`${state.sort_direction === 'ASC' && state.sort_column === 'u.id' ? '' : 'rotate-180'} text-xl mt-1 ml-2 transform duration-300 ease-in-out`}/>
                                </div>
                            </Cell>
                            <Cell>
                                <div onClick={() => handleSort('full_name')} className={`${state.sort_column === 'u.full_name' ? 'text-blue-500' : ''} px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer`}>
                                    <span>Полное Имя</span>
                                    <TiArrowSortedUp className={`${state.sort_direction === 'ASC' && state.sort_column === 'u.full_name' ? '' : 'rotate-180'} text-xl mt-1 ml-2 transform duration-300 ease-in-out`}/>
                                </div>
                            </Cell>
                            <Cell>
                                <div className="px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer">
                                    <span>Телефон</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div onClick={() => handleSort('email')} className={`${state.sort_column === 'u.email' ? 'text-blue-500' : ''} px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer`}>
                                    <span>Электронная почта</span>
                                    <TiArrowSortedUp className={`${state.sort_direction === 'ASC' && state.sort_column === 'u.email' ? '' : 'rotate-180'} text-xl mt-1 ml-2 transform duration-300 ease-in-out`}/>
                                </div>
                            </Cell>
                            <Cell>
                                <div onClick={() => handleSort('deleted')} className={`${state.sort_column === 'u.deleted' ? 'text-blue-500' : ''} px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer`}>
                                    <span>Статус</span>
                                    <TiArrowSortedUp className={`${state.sort_direction === 'ASC' && state.sort_column === 'u.deleted' ? '' : 'rotate-180'} text-xl mt-1 ml-2 transform duration-300 ease-in-out`}/>
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
                                    {item?.email}
                                </div>
                            </Cell>
                            <Cell>
                                <div className="p-2">
                                    <Switcher item_id={item.id} status={!item?.deleted} handleStatus={handleStatus}/>
                                </div>
                            </Cell>
                            <Cell>
                                <div className="p-2 flex justify-center">
                                    <IconButton tooltip = "Добавить локацию" handleClick={() => setState({type:'SET_VISIBLE_ADD_LOCATION_FORM', payload:{id:item.id, full_name:item.full_name, phone:item.phone, email:item.email, locations:item?.locations}})} icon={<TiLocationOutline className="text-2xl"/>}/>
                                    <IconButton tooltip = "Изменить" handleClick={() => setState({type:'SET_VISIBLE_UPDATE_FORM', payload:{id:item.id, full_name:item.full_name, phone:item.phone, email:item.email}})} icon={<BiEdit className="text-2xl"/>}/>
                                    <IconButton tooltip = "Сменить пароль" handleClick={() => setState({type:'SET_VISIBLE_CHANGE_PASSWORD_FORM', payload:{id:item.id, full_name:item.full_name, phone:item.phone, email:item.email}})}  icon={<RiLockPasswordLine className="text-2xl"/>}/>
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

const Header = ({handleSearch, handleClick}) =>(
    <div className="flex flex-row justify-between items-center">
        <IconButton tooltip = "Добавить оператора" handleClick={handleClick} icon={<IoMdAdd className="text-2xl "/>}/>
        <div className="w-80">
            <SearchInput action={(value) => handleSearch(value)} placeholder="Поиск"/>
        </div>
    </div>
);

export default Operators;