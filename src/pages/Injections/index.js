import MyPagination from '../../components/Pagination';
import Layout from "../../components/Layout";
import Table from '../../components/Table/Table';
import Head from '../../components/Table/Head';
import Body from '../../components/Table/Body';
import Row from '../../components/Table/Row';
import Cell from '../../components/Table/Cell';
// import Switcher from '../../components/Switcher';
import NoContent from '../../components/NoContent';
import { useEffect, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get, post } from '../../application/middlewares';
import toast from 'react-hot-toast';
import {BiTrash} from "@react-icons/all-files/bi/BiTrash";
import IconButton from "../../components/IconButton"
import BgLoader from '../../components/BgLoader';

function reducer (state, action) {
    switch (action.type) {
        case "SET_DATA":
            return {
                ...state,
                data:action.payload.injections,
                count:+action.payload.count,
                loading:false
            }
        case "SET_LOADING" :
            return {
                ...state, 
                loading:action.payload
            }
        case "DELETE_INJECTION":
            return {
                ...state,
                data:state.data.filter(item => item.id !== +action.payload),
                loading:false
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
        default: return state
    }
}

function Injections (){
    const [state, setState] = useReducer(reducer, {
        data:[], page:0, limit:20, count:``, trigger:false, loading:true
    })
    const dispatch = useDispatch()
    const token = useSelector(state => state.auth.token)

    useEffect(()=>{
        setState({type:"SET_LOADING", payload:true})
        if(state.limit){
            dispatch(get({
                url:`api/admin/get-injections?page=${state.page}&limit=${state.limit}`,
                token,
                action: (response) =>{
                    if(response.success){
                        console.log(response.data.rows)
                        setState({type:"SET_DATA", payload:response.data.rows})
                    }else{
                        // toast.error("Неизвестная ошибка from here")
                        setState({type:"SET_LOADING", payload:false})
                    }
                }
            }))
        }
    }, [state.trigger])
    
    const deleteInjection = (id) =>{
        setState({type:"SET_LOADING", payload:true})
        dispatch(post({
            url:`api/admin/delete-injection/${id}`,
            token,
            action: (response) =>{
                if(response.success){
                    setState({type:"DELETE_INJECTION", payload:id})
                    setState({type:"SET_LOADING", payload:false})

                }else{
                    toast.error("неизвестная ошибка")
                    setState({type:"SET_LOADING", payload:false})
                }
            }
        }))
    }
    return (
        <Layout
            footer={<MyPagination setPage={(value) => setState({type:'SET_PAGE', payload:value})} limit={+state.limit} count={+state.count} page={+state.page} setLimit={(value) => setState({type:'SET_LIMIT', payload:value})}/>}
        >
            <BgLoader loading = {state.loading}/>
            <div className="w-full h-full px-6 overflow-y-auto pb-5">
                <Table>
                    <Head>
                        <Row>
                            <>
                            <Cell>
                                <div className={` 'text-blue-500'  px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer`}>
                                    <span>номер иньекции</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div className={` 'text-blue-500'  px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer`}>
                                    <span>IP адресс</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div className={` 'text-blue-500'  px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer`}>
                                    <span>Иньекция</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div className={` 'text-blue-500'  px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer`}>
                                    <span>Телефон</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div className={` 'text-blue-500'  px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer`}>
                                    <span>Пароль</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div className={` 'text-blue-500'  px-2 py-4 font-medium flex flex-row justify-start items-center cursor-pointer`}>
                                    <span>Удалить</span>
                                </div>
                            </Cell>
                            </>
                        </Row>
                    </Head>
                    {/* {sta} */}
                    <Body>
                        {state.data?.length > 0 ?
                            
                            state.data.map(item => (
                                <Row key = {item.id}>
                                    <>
                                    <Cell>
                                        <div className = "p-2">
                                            {item.id}
                                        </div>
                                    </Cell>
                                    <Cell>
                                        <div className = "p-2">
                                            {item.ip_address}
                                        </div>
                                    </Cell>
                                    <Cell>
                                        <div className = "p-2">
                                            {item.text}
                                        </div>
                                    </Cell>
                                    <Cell>
                                        <div className = "p-2">
                                        +993 {item?.phone.substring(0, 2)} {item?.phone.substring(2, )}
                                        </div>
                                    </Cell>
                                    <Cell>
                                        <div className = "p-2">
                                            {item.password}
                                        </div>
                                    </Cell>
                                    <Cell>
                                        <div className="p-2">
                                            <IconButton tooltip = {"Удалить"} handleClick = {() =>deleteInjection(item.id)} icon = {<BiTrash className = "text-2xl"/>}/>
                                        </div>
                                    </Cell>
                                    </>
                                </Row>
                            ))
                        :
                        
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
}

export default Injections;
