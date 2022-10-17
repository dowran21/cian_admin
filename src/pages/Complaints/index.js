import {useDispatch, useSelector} from "react-redux"
import {useEffect, useReducer} from "react";
import { get, post } from '../../application/middlewares';
import Layout from "../../components/Layout";
import Body from "../../components/Table/Body";
import Cell from "../../components/Table/Cell";
import Head from "../../components/Table/Head";
import Row from "../../components/Table/Row";
import Table from "../../components/Table/Table";
import toast from "react-hot-toast";
import BgLoader from "../../components/BgLoader";
import NoContent from "../../components/NoContent";
import Switch from "react-switch";
import MyPagination from "../../components/Pagination";

function reducer(state, action){
    console.log(action)
    switch(action.type){
        case "SET_DATA":
            return {
                ...state,
                data:action.payload.complaints,
                count:+action.payload.count,
                loading:false
            }
        case "ACCEPT_COMPLAINT":
            return {
                ...state,
                data:state.data.filter(item => item.id !== action.payload)
            }
        case "SET_ACCEPTED":
            return {
                ...state,
                trigger:!state.trigger,
                accepted:action.payload,
                loading:true
            }
        case "SET_LOADING":
            return {
                ...state,
                loading:action.payload
            }
        case "SET_PAGE":
            return {
                ...state,
                loading:true,
                page:action.payload,
                trigger:!state.trigger
            }
        case "SET_LIMIT":
            return {
                ...state,
                loading:true,
                limit:action.payload,
                page:0,
                trigger:!state.trigger
            }
        default: return state
    }
}


function Complaints (){
    const [state, setState] = useReducer(reducer, {
        data:[], page:0, loading:true, limit:30,
        count:0, accepted:false, trigger:true
    })


    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token)
    useEffect(()=>{
        dispatch(get({
            url:`api/admin/get-complaints?accepted=${state.accepted}&page=${state.page}&limit=${state.limit}`,
            token,
            action: (response) =>{
                if(response.success){
                    console.log(response.data.rows)
                    setState({type:"SET_DATA", payload:response.data.rows})
                }else{
                    toast.error("Неизвестная ошибка")
                }
            }
        }))
    }, [state.trigger])
    const acceptComplaint = (id) =>{
        setState({type:"SET_LOADING", payload:true})
        dispatch(post({
            url:`api/admin/accept-complaint/${id}`,
            token,
            action: (response)=>{
                if(response.success){
                    setState({type:"ACCEPT_COMPLAINT", payload:id})
                    setState({type:"SET_LOADING", payload:false})
                }else{
                    setState({type:"SET_LOADING", payload:false})
                    toast.error("Неизвестна ошибка")
                }
            }
        }))
    }
    return (
        <Layout footer = {<MyPagination setPage={(value) => setState({type:'SET_PAGE', payload:value})} limit={+state.limit} count={+state.count} page={state.page} setLimit={(value) => setState({type:'SET_LIMIT', payload:value})}/>}>
            <div className="flex flex-row justify-start items-start bg-blue-50 w-full h-12 overflow-x-auto">
                    <button  onClick = {()=>setState({type:"SET_ACCEPTED", payload:false})} className={`${state.accepted === false ? 'bg-white' : ''} flex justify-center items-center min-w-200 whitespace-nowrap px-3 h-full rounded-t-lg focus:outline-none`}>
                        Непринятые
                    </button>  
                    <button onClick = {()=>setState({type:"SET_ACCEPTED", payload:true})} className={`${state.accepted ? 'bg-white' : ''} flex justify-center items-center min-w-200 whitespace-nowrap px-3 h-full rounded-t-lg focus:outline-none`}>
                        Принятые
                    </button> 
            </div>
            <BgLoader loading = {state.loading}/>
            <div className="w-full h-full px-6 overflow-y-auto pb-20 ">
                <Table>
                    <Head>
                        <Row>
                            <>
                            <Cell>
                                <div className={`px-2 py-4 font-medium flex flex-row justify-start items-center `}>
                                    <span>Имя отправителя</span>
                                </div>
                            </Cell>
                                <div className={`px-2 py-4 font-medium flex flex-row justify-start items-center `}>
                                    <span>Номер отправителя</span>
                                </div>
                            <Cell>
                                <div className={`px-2 py-4 font-medium flex flex-row justify-start items-center `}>
                                    <span>ID недвижимости</span>
                                </div>
                            </Cell>
                                <div className={`px-2 py-4 font-medium flex flex-row justify-start items-center `}>
                                    <span>Имя адресата</span>
                                </div>
                            <Cell>
                                <div className={`px-2 py-4 font-medium flex flex-row justify-start items-center `}>
                                    <span>Номер адресата</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div className={`px-2 py-4 font-medium flex flex-row justify-start items-center `}>
                                    <span>Жалоба</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div className={`px-2 py-4 font-medium flex flex-row justify-start items-center `}>
                                    <span>Принять</span>
                                </div>
                            </Cell>
                            </>
                        </Row>
                    </Head>
                    <Body>
                        {state.data?.length > 0 ?
                        state.data.map(item => (
                            <Row key = {item.id}>
                                <>
                                <Cell>
                                    <div className = "p-2">
                                        {item.sender_name}
                                    </div>
                                </Cell>
                                <Cell>
                                    <div className = "p-2">
                                    +993 {item?.sender_phone.substring(0, 2)} {item?.sender_phone.substring(2, )}
                                    </div>
                                </Cell>
                                <Cell>
                                    <div className = "p-2">
                                        {item.real_estate_id}
                                    </div>
                                </Cell>
                                <Cell>
                                    <div className = "p-2">
                                        {item.address_name}
                                    </div>
                                </Cell>
                                <Cell>
                                    <div className = "p-2">
                                        {item.address_phone}
                                    </div>
                                </Cell>
                                <Cell>
                                    <div className = "p-2 w-72 break-words">
                                        {item.message}
                                    </div>
                                </Cell>
                                <Cell>
                                    <div className = "p-2">
                                       <Switch onChange = {()=>acceptComplaint(item.id)} checked={item.accepted} disabled = {item.accepted} height={18} width={37}/>
                                    </div>
                                </Cell>
                                </>
                            </Row>
                        ))
                        : state.loading === true ? null :
                            <tr>
                                <td colSpan="10" >
                                    <div className="flex w-full h-full py-20 justify-center items-center">
                                        <NoContent title="Нет Жалоб"/>
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
export default Complaints;