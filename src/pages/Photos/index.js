import { useEffect, useReducer } from "react";
import Layout from "../../components/Layout";
import Form from "./Form"
import IconButton from "../../components/IconButton";
import {IoMdAdd} from "@react-icons/all-files/io/IoMdAdd";
import { useDispatch, useSelector } from "react-redux";
import { get } from '../../application/middlewares';
import BgLoader from "../../components/BgLoader";
import {BiTrash} from "@react-icons/all-files/bi/BiTrash"
import toast from "react-hot-toast";


function reducer(state, action){
    console.log(action)
    switch(action.type){
        case "SET_MODAL_VISIBLE":
            return {
                ...state,
                visible:false
            
        }
    case "SET_VISIBLE_FORM":
        return {
            ...state,
            visible:true,
            form:"add"
        }
    case "SET_DATA":
        return{
            ...state,
            data:action.payload,
            loading:false
        }
    case "ADD_IMAGE":
        return {
            ...state,
            data:[...state.data, {id:action.payload.image_id, destination:action.payload.destination}],
            visible:false
        }
    case "DELETE_IMAGE_FORM":
        return {
            ...state,
            form:"delete_image",
            visible:true,
            values:action.payload
        }
    case "DELETE_IMAGE":
        return {
            ...state,
            data:state.data.filter(item => item.id !== action.payload),
            visible:false
        }
    case "SET_MAIN":
        return {
            ...state, 
            main_id:action.payload,
            trigger:!state.trigger,
            loading:true
        }
    case "SET_PAGES":
        return {
            ...state,
            pages:action.payload
        }
    default: return state
    }
}


function Photos(){
    const [state, setState] = useReducer(reducer, {
        visible:false, places:[], images:[], form:"", values:"", data:[],
        loading:true, main_id : 1, trigger:false, pages:[]
    })
    const dispatch = useDispatch()
    const token = useSelector(state => state.auth.token)

    useEffect(()=>{
        dispatch(get({
            url:`api/admin/page-image-places`,
            token,
            action: (response) =>{
                if(response.success){
                    setState({type:"SET_PAGES", payload:response.data.rows})
                }else{
                    toast.error("Не смогли загрузить места")
                }
            }
        }))
    }, [])
  
    useEffect(()=>{

        dispatch(get({
            url:`api/admin/get-page-images/${state.main_id}`,
            token,
            action: (response) =>{
                if(response.success){
                    console.log(response.data )
                    setState({type:"SET_DATA", payload:response.data.rows})
                }else{
                    toast.error("Неизвестаня ошибка")
                    setState({type:"SET_LOADING", payload:false})
                }
            }
        }))
    }, [state.trigger])
    return(
        <>
        {state.loading ? <BgLoader loading = {state.loading}/> 
        :
        
        <Layout header={<Header handleClick = {()=>setState({type:"SET_VISIBLE_FORM", payload:""})}/>} >
            <Form visible = {state.visible} main_id = {state.main_id} form = {state.form} token= {token} values = {state.values}
                setUploadedImage = {(value)=>setState({type:"ADD_IMAGE", payload:value})}
                setCloseModal = {()=>setState({type:"SET_MODAL_VISIBLE", payload:""})}
                setDeletedImage = {(value)=>setState({type:"DELETE_IMAGE", payload:value})}
            />
            <div className="flex flex-row justify-start items-start bg-blue-50 w-full h-12 overflow-x-auto">
                {state.pages?.length > 0 && state.pages.map(item => (
                    <>
                        <button onClick = {() => setState({type:"SET_MAIN", payload:item.id})} className={`${state.main_id === item.id ? 'bg-white' : ''} flex justify-center items-center min-w-200 whitespace-nowrap px-3 h-full rounded-t-lg focus:outline-none`}>
                            {item.place.slice(0, 30)}
                        </button>
                    </>
                ))
                }
            </div>
            <div className = "w-full h-full px-6 overflow-y-auto">
                <div className = "grid grid-cols-3 gap-8 py-10">
                    {state.data?.map(item =>
                        <div key = {item.id} className = "flex flex-row relative justify-center items-center">
                            <div className = "absolute right-0 top-0 rounded-full">
                                <IconButton tooltip = "Удалить" handleClick = {()=>setState({type:"DELETE_IMAGE_FORM", payload:item})}icon={<BiTrash className="text-2xl "/>}/>
                            </div>
                            <img className = "fill p-2 object-container" src = {`${process.env.REACT_APP_FILE_URL}/${item.destination}`}/>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    }
    </>
    )
};

const Header = ({handleClick})=>(
    <div className="flex flex-row justify-between items-center">
        <IconButton tooltip = "Добавить" handleClick = {handleClick} icon={<IoMdAdd className="text-2xl "/>}/>
    </div>
)


export default Photos;