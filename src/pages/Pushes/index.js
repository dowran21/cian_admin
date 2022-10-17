import Layout from "../../components/Layout";
import {IoMdAdd} from "@react-icons/all-files/io/IoMdAdd";
import IconButton from "../../components/IconButton";
import { useReducer } from "react";
import MyPagination from "../../components/Pagination"
import Form from "./Form"
import { useSelector } from "react-redux";

function reducer(state, action){
    console.log(action.type)
    switch(action.type){
        case "SET_LOADING":
            return{
                ...state,
                loading:action.payload
            }
        case "SET_FORM":
            return {
                ...state,
                form:"add",
                visible:true
            }
        case "SET_LIMIT":
            return {
                ...state,
                limit:action.payload.limmit
            }
        case "SET_PAGE":
            return {
                ...state,
                page:action.payload
            }
        case "SET_CLOSE":
            return {
                ...state,
                visible:false
            }
        default: return state
    }
}

function Pushes () {
    const [state, setState] = useReducer(reducer, {
        laoding:true, visible:false, form:"", count:0, page:0,
        limit:10, data:[]
    })
    const token = useSelector(state => state.auth.token)
    return (
        <Layout header = {<Header handleClick= {()=>setState({type:"SET_FORM", payload:{}})}/>} footer = {<MyPagination setPage={(value) => setState({type:'SET_PAGE', payload:value})} limit={+state.limit} count={+state.count} page={state.page} setLimit={(value) => setState({type:'SET_LIMIT', payload:value})}/>}>
            <Form
                visible = {state.visible}
                token = {token}
                setCloseModal = {()=>setState({type:"SET_CLOSE", payload:{}})}
            />
            
        </Layout>
    )
}

const Header = ({handleClick}) =>{
    return (
        <div className="flex flex-row justify-between items-center">
            <div className = "flex flex-row justify-center items-start"> 
                <div>
                    <IconButton handleClick = {handleClick} icon={<IoMdAdd className="text-3xl "/>}/>
                </div>
            </div>
        </div>
    )
}

export default Pushes;