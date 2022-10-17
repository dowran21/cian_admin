import {useReducer, useEffect} from 'react';
import {IoMdAdd} from "@react-icons/all-files/io/IoMdAdd";
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
import Switcher from '../../components/Switcher';
import NoContent from '../../components/NoContent';
import {useDispatch, useSelector} from 'react-redux'
import { get, post } from '../../application/middlewares';
import toast from 'react-hot-toast';
import Form from './Form';
import BgLoader from '../../components/BgLoader';
import {BiTrash} from "@react-icons/all-files/bi/BiTrash"


function reducer(state, action) {
    console.log(action)
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
        case 'SET_VISIBLE_CREATE_FORM':{
            return{
                ...state,
                values:{},
                visible:true,
                form:'create',
            }
        }
        case 'ADD_SPECIFICATION':{
            return{
                ...state,
                data: state.data.concat(action.payload),
                count:+state.count + 1,
                visible:false,
                values:{},
                form:'',
            }
        }
        case 'UPDATE_SCPECIFICATIONS':{
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
        case "UPDATE_SPEC":
            return{
                ...state, 
                data:state.data.map(item =>{
                    if(item.id === action.payload.id){
                        item.is_required = action.payload.is_required;
                        item.is_multiple = action.payload.is_multiple;
                        item.name_tm = action.payload.translation_tm;
                        item.name_ru=action.payload.translation_ru;

                    }return item;
                })
            }
        case "SET_VISIBLE_DELETE_FORM":
            return {
                ...state,
                form:"delete",
                values:action.payload,
                visible:true
            }
        case "DELETE_SPECIFICATION":
            return {
                ...state, 
                data:state.data.filter(item => item.id !== +action.payload)
            }
        default: return state;
    }
}

function Specfifications(){
    const [state, setState] = useReducer(reducer, {
        loading: false, limit:10, count:0, page:0, data:[],
        sort_direction:'ASC', sort_column:'s.id', trigger:false,
        search:'', visible:false, values:{}, form:''
    });
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    useEffect(() => {
        setState({type:'SET_LOADING', payload:true});
        dispatch(get({
            url:`/api/admin/get-all-specifications/?page=${state.page}&limit=${state.limit}&sort_direction=${state?.sort_direction}&sort_column=${state?.sort_column}&search=${state.search}`,
            token,
            action:(response) =>{
                console.log(response)
                if(response.success){
                    setState({type:'SET_DATA', payload:{count: +response.data?.count, data:response.data?.specifications?.length > 0 ? response.data?.specifications : []}})
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
            url:`/api/admin/activation-of-specification/${item_id}`,
            data:{is_active:value},
            token,
            action:(response) => {
                if(response.success){
                    setState({type:'SET_STATUS', payload:{id:item_id, is_active:value}})
                }else{
                }
                setLoading(false);
            }
        }))
    }
    return(
        <Layout header={<Header handleSearch={handleSearch} handleClick={() => setState({type:'SET_VISIBLE_CREATE_FORM'})}/>} footer={<MyPagination setPage={(value) => setState({type:'SET_PAGE', payload:value})} limit={+state.limit} count={+state.count} page={state.page} setLimit={(value) => setState({type:'SET_LIMIT', payload:value})}/>}>
            <Form  form={state.form} 
                addSpecification={(value) => setState({type:'ADD_SPECIFICATION', payload:value})} 
                updateSpecification={(value) => setState({type:'UPDATE_SCPECIFICATIONS', payload:value})} 
                token={token} values={state.values} visible={state.visible} 
                setCloseModal={() => setState({type:'SET_CLOSE_MODAL'})}
                setUpdateSpec = {(value) => setState({type:"UPDATE_SPEC", payload:value})}
                deleteSpec = {(value) => setState({type:"DELETE_SPECIFICATION", payload:value})}
                />
            <BgLoader loading={state.loading}/>
            <div className="w-full h-full px-6 overflow-y-auto">
                <Table>
                    <Head>
                        <Row>
                            <>
                            <Cell>
                                <div onClick={() => handleSort('s.id')} className={`${state.sort_column === 's.id' ? 'text-blue-500' : ''} px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer`}>
                                    <span>ID</span>
                                    <TiArrowSortedUp className={`${state.sort_direction === 'ASC' && state.sort_column === 's.id' ? '' : 'rotate-180'} text-xl mt-1 ml-2 transform duration-300 ease-in-out`}/>
                                </div>
                            </Cell>
                            <Cell>
                                
                                <div className={`px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer whitespace-nowrap`}>
                                    <span>На туркменском</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div className={`px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer`}>
                                    <span>На русском</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div className="px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer">
                                    <span>Обьязательно</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div className="px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer">
                                    <span>Несколько</span>
                                </div>
                            </Cell>
                            <Cell>  
                                <div onClick={() => handleSort('is_active')} className={`${state.sort_column === 'is_active' ? 'text-blue-500' : ''} px-2 py-4 -mt-6 font-medium flex flex-row justify-start items-start cursor-pointer`}>
                                    <span>Статус</span>
                                    <TiArrowSortedUp className={`${state.sort_direction === 'ASC' && state.sort_column === 'is_active' ? '' : 'rotate-180'} text-xl mt-1 ml-2 transform duration-300 ease-in-out`}/>
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
                                    {/* {item.translations.map(item1 => {
                                        if(item1.language_id === 1){
                                            return (
                                                item1.name
                                            )
                                    } })} */}
                                    {item.name_tm}
                                </div>
                            </Cell>
                            <Cell>
                                <div className="p-2">
                                {/* {item.translations.map(item1 => {
                                        if(item1.language_id === 2){
                                            return (
                                                item1.name
                                            )
                                    } })} */}
                                    {item.name_ru}
                                </div>
                            </Cell>
                            <Cell>
                                <div className="p-2">
                                    {item?.is_required === true ? 'Да' : 'Нет'}
                                </div>
                            </Cell>
                            <Cell>
                                <div className="p-2">
                                    {item?.is_multiple === true ? 'Да' : 'Нет'}
                                </div>
                            </Cell>
                            <Cell>
                                <div className="p-2">
                                    <Switcher item_id={item.id} status={item?.is_active} handleStatus={handleStatus}/>
                                </div>
                            </Cell>
                            <Cell>
                                <div className="p-2 flex justify-center">
                                    <IconButton tooltip = "Изменить" handleClick={() => setState({type:'SET_VISIBLE_UPDATE_FORM', payload:{id:item.id, translation_tm:item?.name_tm, translation_ru:item?.name_ru, is_required:item?.is_required, is_multiple:item?.is_multiple }})} icon={<BiEdit className="text-2xl"/>}/>
                                    <IconButton tooltip = "Удалить" handleClick={() => setState({type:'SET_VISIBLE_DELETE_FORM', payload:{id:item.id, translation_tm:item?.name_tm, translation_ru:item?.name_ru, is_required:item?.is_required, is_multiple:item?.is_multiple }})} icon={<BiTrash className="text-2xl"/>}/> 
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
                                    <NoContent title="Нет Спецификации"/>
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
        <IconButton tooltip = "Добавить" handleClick={handleClick} icon={<IoMdAdd className="text-2xl "/>}/>
        <div className="w-80">
            <SearchInput action={(value) => handleSearch(value)} placeholder="Поиск"/>
        </div>
    </div>
);

export default Specfifications;