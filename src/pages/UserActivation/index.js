import { useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get, post } from "../../application/middlewares";
import Layout from "../../components/Layout";
import MyPagination  from "../../components/Pagination";
import SearchInput from "../../components/SearchInput";
import toast from 'react-hot-toast';
import BgLoader from "../../components/BgLoader";
import Table from "../../components/Table/Table";
import Head from "../../components/Table/Head";
import Row from "../../components/Table/Row";
import Cell from "../../components/Table/Cell";
import Body from "../../components/Table/Body";
import NoContent from "../../components/NoContent";
import Switch from 'react-switch';
import IconButton from "../../components/IconButton";
import {BiTrash} from "@react-icons/all-files/bi/BiTrash"



function reducer (state, action){
    switch(action.type){
        case "SET_DATA":
            return {
                ...state,
                data:action.payload?.act_users,
                count:+action.payload?.count,
                loading:false
            }
        case "SET_LOADING":
            return{
                ...state,
                loading:action.payload
            }
        case "SET_SEARCH":
            return{
                ...state,
                search:action.payload,
                trigger:!state.trigger
            }
        case "REMOVE_IP":
            return {
                ...state,
                count:state.count-1,
                data:state.data.filter(item => item.access_ip !== action.payload),
                loading:false
            }
        case "SET_PAGE":
            return {
                ...state,
                page:action.payload,
                trigger:!state.trigger,
                loading:true
            }
        case "SET_LIMIT":
            return{
                ...state,
                limit:action.payload,
                trigger:!state.trigger,
                loading:true
            }
        default: return state;
    }
}


function UserActivation (){
    const [state, setState] = useReducer(reducer, {
        page:0, limit:10, count:0, data:[], search:"",
        count:0, loading:true, trigger:false
    })
    const token = useSelector(state => state.auth.token)
    const dispatch = useDispatch();

    const handleSearch = (value) => {
        setState({type:'SET_SEARCH', payload:value})
    }
    useEffect(()=>{
        dispatch(get({
            url :`api/admin/get-user-for-activation?page=${state.page}&limit=${state.limit}&search=${state.search}`,
            token,
            action: (response) =>{
                if(response.success){
                    // console.log(response.data.rows)
                    setState({type:"SET_DATA", payload:response.data?.rows})
                }else{
                    setState({type:"SET_LOADING", payload:false})
                    toast.error('Неизвестная ошибка')
                }
            }
        }))
    }, [state.trigger])

    const activateUser = (value) =>{
        setState({type:"SET_LOADING", payload:true})
        dispatch(post({
            url:`api/admin/activate-user-ip/${value}`,
            token,
            action : (response) =>{
                if(response.success){
                    setState({type:"REMOVE_IP", payload:value})
                }else{
                    toast.error('Неизвестная ошибка')
                }
            }
        }))
    }
    return (
        <Layout header = {<Header handleSearch = {handleSearch}/>} footer = {<MyPagination setPage ={(value)=>setState({type:"SET_PAGE", payload:value})} count = {+state.count} page = {state.page} limit = {+state.limit} setLimit={(value)=>setState({type:"SET_LIMIT", payload:value})}/>}>
            <BgLoader loading={state.loading}/>
            <div className="w-full h-full px-6 overflow-y-auto">
            <Table>
                <Head>
                    <Row>
                        <>
                        <Cell>
                            <div  className={`px-2 py-4 font-medium flex flex-row justify-start items-center `}>
                                <span>ID</span>
                            </div>
                        </Cell>
                        <Cell>
                            <div  className={`px-2 py-4 font-medium flex flex-row justify-start items-center `}>
                                <span>Имя</span>
                            </div>
                        </Cell>
                        <Cell>
                            <div  className={`px-2 py-4 font-medium flex flex-row justify-start items-center `}>
                                <span>Телефон</span>
                            </div>
                        </Cell>
                        <Cell>
                            <div  className={`px-2 py-4 font-medium flex flex-row justify-start items-center `}>
                                <span>IP адресс</span>
                            </div>
                        </Cell>
                        <Cell>
                            <div  className={`px-2 py-4 font-medium flex flex-row justify-start items-center `}>
                                <span>Код</span>
                            </div>
                        </Cell>
                        <Cell>
                            <div  className={`px-2 py-4 font-medium flex flex-row justify-start items-center `}>
                                <span>Активировать</span>
                            </div>
                        </Cell>
                        <Cell>
                            <div  className={`px-2 py-4 font-medium flex flex-row justify-start items-center `}>
                                <span>Удалить</span>
                            </div>
                        </Cell>
                        </>
                    </Row>
                </Head>
                <Body>
                    {state.data?.length > 0 ?
                        state.data.map(item=>(
                            <Row key = {item.id}>
                                <>
                                <Cell >
                                    <div className = "p-2">
                                        {item.user_id}
                                    </div>
                                </Cell>
                                <Cell >
                                    <div className = "p-2">
                                        {item.full_name}
                                    </div>
                                </Cell>
                                <Cell >
                                    <div className = "p-2">
                                    +993 {item?.phone.substring(0, 2)} {item?.phone.substring(2, )}
                                    </div>
                                </Cell>
                                <Cell >
                                    <div className = "p-2">
                                        {item.ip_address}
                                    </div>
                                </Cell>
                                <Cell >
                                    <div className = "p-2">
                                        {item.code}
                                    </div>
                                </Cell>
                                <Cell >
                                    <div className = "w-12 h-12 flex justify-center items-center">
                                        <Switch onChange = {()=>activateUser(item?.access_ip)} checked = {false} height = {18} width = {37} />
                                    </div>
                                </Cell>
                                <Cell >
                                    <div className = "p-2">
                                       <IconButton handleClick = {()=>activateUser(item?.access_ip)} icon={<BiTrash className="text-3xl "/>}/>
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
                                    <NoContent title="Нет Активаций"/>
                                </div>
                            </td>
                        </tr>
                }
                </Body>
            </Table>
            </div>
        </Layout>
    )
}

const Header = ({handleSearch}) =>(
    <div className="flex flex-row justify-between items-center">
        <div className="w-80">
            <SearchInput action = {(value) => handleSearch(value)} placeholder="Поиск"/>
        </div>
    </div>
);

export default UserActivation;