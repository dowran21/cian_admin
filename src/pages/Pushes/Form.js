import { useEffect, useReducer } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { get, post } from "../../application/middlewares";
import ModalContainer from "../../components/ModalContainer";

function reducer(state, action) {
    switch(action.type){
        case "SET_DATA":
            return {
                ...state,
                types:action.payload
            }
        default: return state
    }
}

function Form ({form, visible, setCloseModal, token}){
    const [state, setState] = useReducer(reducer, {
        types:[], 
    })
    const {register, handleSubmit, setValue, formState : {errors}, watch} = useForm({
        // resolver:
    })
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(get({
            url: `api/ru/categories-types`,
            action : (response) =>{
                if(response.success){
                    console.log(response.data)
                    setState({type:"SET_DATA", payload:response.data.rows})
                }else{
                    toast.error("Неизвестная ошибка при загрузке типов")
                }
            }
        }))
    }, [])
    
    const onSubmit = (data) =>{
        dispatch(post({
            url:`api/admin/add-push-notify`,
            data, 
            token,
            action : (response) =>{
                console.log(response)
                setCloseModal()
            }
        }))
    }

    return (
        <ModalContainer size = "lg"
        setCloseModal = {()=>setCloseModal()}
        title  = "PUSH уведомление"
        visible = {visible}
        >
            <form onSubmit = {handleSubmit(onSubmit)}>
                <div className = "flex flex-col">
                    <div className = "py-3">
                        <label>Тип сделки
                            <select onChange = {(e)=>setValue("category_id", e.target.value)} className = "px-3 py-2 placeholder-gray-400 text-gray-700 dark:text-gray-200  bg-white dark:bg-gray-700 rounded text-sm focus:outline-none  border-0 ring-1 ring-gray-300 dark:ring-gray-800 focus:ring-purple-700 dark:focus:ring-2 dark:focus:ring-gray-600 w-full"  >
                                <option key = {0} value = {0}>Выберите тип сделки</option>
                                <option key = {1} value = {1}>Правдется</option>
                                <option key = {2} value = {2}>Сдается в аренду</option>
                            </select>
                        </label>
                    </div>
                    <div className = "py-3">
                        <label> Выберите тип недвижимости
                            <select onChange = {(e)=>setValue("type_id", e.target.value)} className = "px-3 py-2 placeholder-gray-400 text-gray-700 dark:text-gray-200  bg-white dark:bg-gray-700 rounded text-sm focus:outline-none  border-0 ring-1 ring-gray-300 dark:ring-gray-800 focus:ring-purple-700 dark:focus:ring-2 dark:focus:ring-gray-600 w-full"  >
                                <option key = {0} value = {0}>Выберите тип недвижимости</option>
                                {state.types?.length  ? 
                                    state.types[watch("category_id")-1]?.main_types.map(item => 
                                        item.sub_types?.map(item_sub =>{
                                            return (
                                                <option key = {item_sub.id} value = {item_sub.id}> {item_sub.name}</option>
                                            )
                                        })
                                        )
                                        
                                :
                                    <option key = {1}> No choice </option>
                                }                        
                            </select>
                        </label>
                    </div>
                    <div >
                        <label>Цена</label>
                        <div className = "flex flex-row p-3">
                            <input type="text" {...register("max_price")}
                                    autoComplete="false"
                                    className={`${errors.max_price ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} px-5 shadow-inner h-10 w-1/2 text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2 `}
                                    placeholder="от"
                                />
                                <p className="absolute bottom-0 left-0 -mb-4 text-xs font-medium text-red-400">
                                    {errors.max_price?.message}
                                </p>
                                <input type="text" {...register("min_price")}
                                    autoComplete="false"
                                    className={`${errors.min_price ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} px-5 shadow-inner h-10 w-1/2 text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2 `}
                                    placeholder="до"
                                />
                                <p className="absolute bottom-0 left-0 -mb-4 text-xs font-medium text-red-400">
                                    {errors.min_price?.message}
                                </p>
                        </div>
                    </div>    
                    <div >
                        <label>Площадь</label>
                        <div className = "flex flex-row p-3">
                            <input type="text" {...register("max_area")}
                                    autoComplete="false"
                                    className={`${errors.max_area ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} px-5 shadow-inner h-10 w-1/2 text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2 `}
                                    placeholder="от"
                                />
                                <p className="absolute bottom-0 left-0 -mb-4 text-xs font-medium text-red-400">
                                    {errors.max_area?.message}
                                </p>
                                <input type="text" {...register("min_area")}
                                    autoComplete="false"
                                    className={`${errors.min_area ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} px-5 shadow-inner h-10 w-1/2 text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2 `}
                                    placeholder="до"
                                />
                                <p className="absolute bottom-0 left-0 -mb-4 text-xs font-medium text-red-400">
                                    {errors.min_area?.message}
                                </p>
                        </div>
                    </div>   
                    <div className = "flex flex-col py-3">
                        <label className = "pb-3">Сообщение на русском</label>
                        <textarea type="text" {...register("message_ru")} name="message_ru"
                            autoComplete="false"
                            className={`${errors.message_ru ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} p-3 shadow-inner h-24 text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2 `}
                            placeholder="Сообщение не может быть пустым"
                        />
                    </div>   
                    <div className = "flex flex-col py-3">
                        <label className = "pb-3">Сообщение на туркменском</label>
                        <textarea type="text" {...register("message_tm")} name="message"
                            autoComplete="false"
                            className={`${errors.message_tm ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} p-3 shadow-inner h-24 text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2 `}
                            placeholder="Сообщение не может быть пустым"
                        />
                    </div>         
                </div>
                <div className = "pt-5 w-full px-3">
                    <button type = "submit" className="w-full rounded-r text-center py-3 bg-green-400 text-white focus:outline-none">
                            Отправить
                    </button>
                </div> 
            </form>
        </ModalContainer>
    )
}
export default Form;