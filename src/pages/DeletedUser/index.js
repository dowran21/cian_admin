import Layout from "../../components/Layout" 
import BgLoader from "../../components/BgLoader";
import { useEffect, useReducer, useState } from "react";
import Table from '../../components/Table/Table';
import Head from '../../components/Table/Head';
import Body from '../../components/Table/Body';
import Row from '../../components/Table/Row';
import Cell from '../../components/Table/Cell';
import Switcher from '../../components/Switcher';
import NoContent from '../../components/NoContent';
import IconButton from '../../components/IconButton'
import {BiTrash} from "@react-icons/all-files/bi/BiTrash"
import { useDispatch, useSelector } from "react-redux";
import { get, post } from "../../application/middlewares";
import toast from "react-hot-toast";

function reducer (state, action){
    switch (action.type) {
        case "SET_DATA":
            return {
                ...state,
                data:action.payload,
                loading:false
            }
        case "SET_LOADING":
            return {
                ...state,
                loading:action.payload
            }
        case "DELETE_USER":
            return {
                ...state,
                data:state.data.filter(item => +item.id !== +action.payload),
                loading:false 
            }
        default: return {...state}
    }
}

function DeletedUsers (){

    const [state, setState] = useReducer(reducer, {
        data:[], loading:true
    })
    const dispatch = useDispatch();
    const token = useSelector(state => state?.auth?.token)
    useEffect(()=>{
        dispatch(get({
            url:`/api/admin/deleted-users`,
            token,
            action: (response) =>{
                console.log(response)
                if(response.success){
                    setState({type:"SET_DATA", payload:response.data.users})
                }
            }
        }))
    }, [])
    const DeletedUsers = (item) =>{
        setState({type:"SET_LOADING", payload:true})
        dispatch(post({
            url:`/api/admin/delete-user/${item.id}`,
            token,
            action : (response) =>{
                if(response.success){
                    setState({type:"DELETE_USER", payload:item.id})
                }else{
                    toast.error("Неизвестная ошибка")
                }
            }
        }))
    }
    return (
        <Layout>
            <BgLoader loading={state.loading}/>
            <div className="w-full h-full px-6 overflow-y-auto">
            <Table>
                    <Head>
                        <Row>
                            <>
                            <Cell>
                                <div  className={`${state.sort_column === 'id' ? 'text-blue-500' : ''} px-2 py-4 font-medium flex flex-row justify-center items-center cursor-pointer`}>
                                    <span>ID</span>
                                    {/* <TiArrowSortedUp className={`${state.sort_direction === 'ASC' && state.sort_column === 'id' ? '' : 'rotate-180'} text-xl mt-1 ml-2 transform duration-300 ease-in-out`}/> */}
                                </div>
                            </Cell>
                            <Cell>
                                <div  className={`${state.sort_column === 'full_name' ? 'text-blue-500' : ''} px-2 py-4 font-medium flex flex-row justify-center items-center cursor-pointer`}>
                                    <span>Полное Имя</span>
                                    {/* <TiArrowSortedUp className={`${state.sort_direction === 'ASC' && state.sort_column === 'full_name' ? '' : 'rotate-180'} text-xl mt-1 ml-2 transform duration-300 ease-in-out`}/> */}
                                </div>
                            </Cell>
                            <Cell>
                                <div className="px-2 py-4 font-medium flex flex-row justify-center items-center cursor-pointer">
                                    <span>Телефон</span>
                                </div>
                            </Cell>
                            <Cell>
                                <div  className={`${state.sort_column === 'email' ? 'text-blue-500' : ''} px-2 py-4 font-medium flex flex-row justify-center items-center cursor-pointer`}>
                                    <span>Электронная почта</span>
                                    {/* <TiArrowSortedUp className={`${state.sort_direction === 'ASC' && state.sort_column === 'email' ? '' : 'rotate-180'} text-xl mt-1 ml-2 transform duration-300 ease-in-out`}/> */}
                                </div>
                            </Cell>
                            <Cell>
                                <div  className={`${state.sort_column === 'email' ? 'text-blue-500' : ''} px-2 py-4 font-medium flex flex-row justify-center items-center cursor-pointer`}>
                                    <span>Тип пользоватлея</span>
                                    {/* <TiArrowSortedUp className={`${state.sort_direction === 'ASC' && state.sort_column === 'owner_id' ? '' : 'rotate-180'} text-xl mt-1 ml-2 transform duration-300 ease-in-out`}/> */}
                                </div>
                            </Cell>
                            
                            {/* <Cell>
                                <div className="px-2 py-4 font-medium text-center">
                                    Разрешение
                                </div>
                            </Cell> */}
                            
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
                                    {+item.owner_id === 1 ? `собственник`: `риелтор`}
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
                                <div className="p-2 flex justify-center items-center">
                                    {item.created_at}
                                </div>
                            </Cell>
                            <Cell>
                                <div className="p-2 justify-center items-center">
                                    <IconButton tooltip={`Удалить`} handleClick = {() =>DeletedUsers(item)} icon = {<BiTrash className = "text-2xl"/>}/>
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
                                    <NoContent title="Нет Пользователей"/>
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

export default DeletedUsers;