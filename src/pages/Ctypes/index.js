import {useReducer, useEffect} from 'react';
import {BiEdit} from "@react-icons/all-files/bi/BiEdit";
import {BsImage} from "@react-icons/all-files/bs/BsImage";
import IconButton from "../../components/IconButton";
import Layout from "../../components/Layout";
import Table from '../../components/Table/Table';
import Head from '../../components/Table/Head';
import Body from '../../components/Table/Body';
import Row from '../../components/Table/Row';
import Cell from '../../components/Table/Cell';
import NoContent from '../../components/NoContent';
import {useDispatch, useSelector} from 'react-redux'
import { get } from '../../application/middlewares';
import toast from 'react-hot-toast';
import Form from './Form';
import BgLoader from '../../components/BgLoader';
import {IoMdAdd} from "@react-icons/all-files/io/IoMdAdd";
import {BiTrash} from "@react-icons/all-files/bi/BiTrash"
import {BiEditAlt} from "@react-icons/all-files/bi/BiEditAlt"


function reducer(state, action) {
    console.log(action)
    switch (action.type) {
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            }
        case 'SET_DATA':
            return{
                ...state, loading:false, data:action.payload.data
            }
        case 'SET_CLOSE_MODAL':{
            return{
                ...state,
                values:{},
                visible:false,
                form:''
            }
        }
        case 'UPLOADED_IMAGE':{
            return{
                ...state,
                data:state.data.map(item => {
                    if(item.id === action.payload.id){
                        return {...item, destination:action.payload.destination}
                    }return item;
                }),
                values:{...state.values, destination:action.payload.destination}
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
        case 'SET_VISIBLE_ADD_FORM':{
            return {
                ...state,
                values:{},
                visible:true,
                form:'add_type'
            }
        }
        case"SET_VISIBLE_DELETE_FORM":{
            return {
                ...state,
                values:action.payload,
                visible:true,
                form:'delete_ctype'
            }
        }
        case "SET_VISIBLE_UPDATE_TYPE":{
            return {
                ...state,
                values:action.payload,
                visible:true,
                form:"update_type"
            }
        }
        case 'ADD_NEW_TYPE':{
            return{
                ...state,
                data: [...state.data, ...action.payload]
            }
        }
        case "DELETE_CTYPE":{
            return {
                ...state,
                data:state.data.filter(item => item.id !== +action.payload),
                visible:false,
            }
        }
        case "UPDATE_TYPE":{
            return {
                ...state,
                data:state.data.map(item => {
                    if(item.type_id === +action.payload.type_id){
                        item.name_ru = action.payload.name_ru
                        item.name_tm = action.payload.name_tm
                    }return item;
                })
            }
        }
        default: return state;
    }
}

function Ctypes(){
    const [state, setState] = useReducer(reducer, {
        loading: false, data:[], trigger:false,
        search:'', visible:false, values:{}, form:''
    });
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    useEffect(() => {
        setState({type:'SET_LOADING', payload:true});
        dispatch(get({
            url:`/api/admin/all-types/`,
            token,
            action:(response) =>{
                if(response.success){
                    console.log(response.data)
                    setState({type:'SET_DATA', payload:{count: +response.data?.count, data:response.data?.rows?.length > 0 ? response.data?.rows : []}})
                }else{
                    setState({type:'SET_LOADING', payload:false});
                    toast.error('Неизвестная ошибка')
                }
            }
        }));// eslint-disable-next-line
    }, [state.trigger]);

    // const handleClick = () =>{
    //     console.log("Hello i am in handle click")
        
    // }

    return(
        <Layout header = {<Header handleClick = {() => setState({type:"SET_VISIBLE_ADD_FORM", payload:{}})}/>}>
            <Form  form={state.form} 
                setUploadedImage={(value) => setState({type:'UPLOADED_IMAGE', payload:value})} 
                updateOperator={(value) => setState({type:'UPDATE_OPERATOR', payload:value})} token={token} 
                values={state.values} visible={state.visible} 
                setCloseModal={() => setState({type:'SET_CLOSE_MODAL'})}
                addNewType = {(value) => setState({type:"ADD_NEW_TYPE", payload:value})}
                deleteCtypeData = {(value)=>setState({type:"DELETE_CTYPE", payload:value})} 
                updateTypeNames = {(value) => setState({type:"UPDATE_TYPE", payload:value})}
            />
            <BgLoader loading={state.loading}/>
            <div className="w-full h-full px-6 overflow-y-auto">
                <Table>
                    <Head>
                        <Row>
                            <>
                            <Cell>
                                <div className={`px-2 py-4 font-medium`}>
                                    <span>ID</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div className={`px-2 py-4 font-medium`}>
                                    <span>Тип сделки</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div className="px-2 py-4 font-medium">
                                    <span>Категории недвижимости</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div className={`px-2 py-4 font-medium text-center`}>
                                    <span>Фотография</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div className={`px-2 py-4 font-medium`}>
                                    <span>На туркменском</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div className={`px-2 py-4 font-medium`}>
                                    <span>На русском</span>
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
                                    {item?.name}
                                </div>
                            </Cell>
                            <Cell>
                                <div className="p-2">
                                    {item?.main_type_name}
                                </div>
                            </Cell>
                            <Cell>
                                <div className="p-2 flex justify-center items-center">
                                    {item?.destination ? <img className="object-contain rounded-md w-28 h-28" src={`${process.env.REACT_APP_FILE_URL}/${item?.destination}`} alt="CTYPES" />: <BsImage className="text-4xl text-gray-500 opacity-80"/>}
                                </div>
                            </Cell>
                            <Cell>
                                <div className="p-2 whitespace-nowrap">
                                    {item?.name_tm}
                                </div>
                            </Cell>
                            <Cell>
                                <div className="p-2 whitespace-nowrap">
                                    {item?.name_ru}
                                </div>
                            </Cell>
                            <Cell>
                                <div className="p-2 flex flex-row justify-center">
                                    <IconButton tooltip = "Посмотреть" handleClick={() => setState({type:'SET_VISIBLE_UPDATE_FORM', payload:{id:item.id, name:item?.name, destination:item?.destination, name_ru:item.name_ru, main_type_name:item.main_type_name, type_id:item?.type_id}})} icon={<BiEdit className="text-2xl"/>}/>
                                    <IconButton tooltip = "Удалить" handleClick={() => setState({type:'SET_VISIBLE_DELETE_FORM', payload:{id:item.id, name:item?.name, destination:item?.destination, name_ru:item.name_ru, main_type_name:item.main_type_name, type_id:item?.type_id}})} icon={<BiTrash className="text-2xl"/>}/>
                                    <IconButton tooltip = "Изменить тип" handleClick={() => setState({type:'SET_VISIBLE_UPDATE_TYPE', payload:{id:item.id, name:item?.name, destination:item?.destination, name_ru:item.name_ru,name_tm:item.name_tm, main_type_name:item.main_type_name, type_id:item?.type_id}})} icon={<BiEditAlt className="text-2xl"/>}/>
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
                                    <NoContent title="Нет Типов"/>
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

const Header = ({handleClick}) =>(
    <div className="flex flex-row justify-between items-center">
        <IconButton tooltip = {`Добавить тип`} handleClick = {handleClick} icon={<IoMdAdd className="text-2xl "/>}/>
        <div className="w-80">
            {/* <SearchInput action={(value) => handleSearch(value)} placeholder="Поиск"/> */}
        </div>
    </div>
);


export default Ctypes;

/* <Header handleClick={() => setState({type:'SET_VISIBLE_CREATE_FORM'})}
const Header = ({ handleClick}) =>(
    <div className="flex flex-row justify-between items-center">
        <IconButton handleClick={handleClick} icon={<IoMdAdd className="text-2xl "/>}/>
        <div className="w-80">
        </div>
    </div>
); */

// const handleStatus = ({setLoading, value, item_id }) =>{
//     dispatch(post({
//         url:`/api/admin/delete-operator/${item_id}`,
//         data:{deleted:!value},
//         token,
//         action:(response) => {
//             if(response.success){
//                 setState({type:'SET_STATUS', payload:{id:item_id, deleted:!value}})
//             }else{
//                 console.log(response)
//             }
//             setLoading(false);
//         }
//     }))
// }