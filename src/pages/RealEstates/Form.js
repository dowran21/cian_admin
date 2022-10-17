import { get, post } from '../../application/middlewares/index';
import { useDispatch } from 'react-redux';
import ModalContainer from '../../components/ModalContainer';
import { useEffect, useReducer } from 'react';
import {formatDate} from '../../utils/format'
import Loader from '../../components/Loader';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {BiTrash} from "@react-icons/all-files/bi/BiTrash"
import IconButton from "../../components/IconButton";
import toast from 'react-hot-toast';



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
                ...state, loading:false, data:action.payload
            }
        case "SET_DELETE_IMAGE":
            return{
                ...state,
                visible2:true, 
                image:action.payload
            }
        case "SET_CLOSE_MODAL2":
            return {
                ...state,
                visible2:false
            }
        case "DELETE_IMAGE_FORM":
            return {
                ...state,
                visible2:true,
                image:action.payload
            }
        case "DELETE_IMAGE":
            return {
                ...state,
                data:{...state.data, images:state.data.images.filter(item => item.id !== action.payload)}
            }
        default: return state;
    }
}

function Form({ visible, setCloseModal, values, token, setSubmitData, form, setSubmitVip, setRemovedEstate}) {
    const [state, setState] = useReducer(reducer, {
        loading: false, data:{}, visible2:false, image:null
    });

    const {handleSubmit, register, setValue, watch, formState :{errors}, getValues, reset } = useForm({
        resolver: yupResolver(schema(form)),
        defaultValues:{description_tm:state.data.description_tm, comment:"", description_ru:state.data.description_ru, is_active:""}
    })

    
    const dispatch = useDispatch();

    useEffect(() =>{
        setState({type:'SET_LOADING', payload:true})
        if(visible === true){
            dispatch(get({
                url:`api/admin/get-real-estate/${values.id}`,
                token,
                action:(response) =>{
                    if(response.success){
                        // console.log(response.data)
                        setState({type:'SET_DATA', payload:response.data})
                        
                    }else{
                        setState({type:'SET_LOADING', payload:false})
                    }
                }
            }))
        }// eslint-disable-next-line
    }, [visible]);
    
    useEffect(()=>{
        setValue("description_tm", state.data.description_tm)
        setValue("description_ru", state.data.description_ru)
        setValue("comment", "")
        setValue('is_active', null)
    }, [state.data])
    

    const onSubmit = (data) =>{
        console.log(data)
        dispatch(post({
            url: 
                form === "watch" ? `api/admin/activation-real-estate/${values.id}` 
                : form === "PUSH" ? `api/admin/add-to-notification/${values.id}`
                : form === "remove" ? `api/admin/remove-real-estate/${values.id}` 
                :`api/admin/add-to-vip/${form === "VIP" ? `1` : `2`}/${values.id}`,
            token,
            data,
            action:(response)=>{
                if(response.success){
                    console.log(response.data)
                    setState({type:'SET_LOADING', payload:false})
                    if(form==='watch'){
                        setSubmitData({id:values.id})
                    }else if(form === "PUSH"){
                        toast.success("Успешно добавилось в пуш уведомления")
                        setCloseModal()
                    }else if(form === "remove"){
                        setRemovedEstate(values.id)
                    }else{
                        setSubmitVip(response.data.rows)
                        setCloseModal()
                    }
                    setValue("is_active",null)
                    reset({})
                }else{
                    setState({type:'SET_LOADING', payload:false})
                    // setVisible2(false)
                    reset({})
                }
            }
        }))
    }

    const DeleteImage = (id)=>{
        setState({type:"SET_LOADING", payload:true})
        dispatch(post({
            url:`api/admin/delete-image/${id}`,
            token,
            action: (response) =>{
                if(response.success){
                    setState({type:"DELETE_IMAGE", payload:id})
                    setState({type:"SET_CLOSE_MODAL2", payload:{}})
                    setState({type:"SET_LOADING", payload:false})
                }else{
                    toast.error("Неизвестная ошибка")
                    setState({type:"SET_LOADING", payload:false})
                    setState({type:"SET_CLOSE_MODAL2", payload:{}})
                    setCloseModal()
                }
            }
        }))
    }
    useEffect(()=>{
        console.log(getValues("is_active"))
    }, [watch("is_active")])

    // const [visible2, setVisible2] = useState(false)
    
    return (
        <ModalContainer size="lg" 
            setCloseModal={() => {setCloseModal(); reset({})}} 
            visible={visible} 
            title={
                form === "watch"?'Форма Подтверждения' 
                : form === "VIP" ? 'Форма Добавления к VIP' 
                : form === "TOP" ? 'Форма Добавления к VIP' 
                : form === "remove" ? "Убрать объявление" 
                : 'Форма добавления к PUSH'  }
            
        >
            <ModalContainer size = "md" 
                visible = {state.visible2} 
                // image = {state.image}
                setCloseModal = {()=>setState({type:"SET_CLOSE_MODAL2", payload:{}})}    
            >
                <div className = "pb-6 flex flex-col w-full">
                    <img className = " h-screen w-full" src = {`${process.env.REACT_APP_FILE_URL}/${state.image?.destination}-large.webp`}/>
                    <div className = "flex flex-row">
                    <button onClick = {()=>setCloseModal()}className="w-1/2 rounded-l text-center py-3 bg-green-400 text-white focus:outline-none">
                            Отменить
                        </button>
                        <button onClick = {()=>DeleteImage(state.image?.id)} className="w-1/2 rounded-r text-center py-3 bg-red-400 text-white focus:outline-none">
                            Удалить
                        </button>  
                    </div>
                </div>
            </ModalContainer>
        <form onSubmit = {handleSubmit(onSubmit)} className = "">
            {form === "watch" ? 
            <div className="relative flex flex-col w-full min-w-700 overflow-y-auto">
                
                <div className={`${state.loading === true ? 'fixed z-30  top-0 left-0 w-full h-full flex justify-center items-center' : 'hidden'}`}>
                    <div className="absolute z-30 w-full rounded-xl h-full bg-indigo-400 opacity-50"></div>
                    <Loader size="xl"/>  
                </div>
                <div className="flex flex-row  w-full h-64 max-w-2xl overflow-x-auto">
                    {state.data?.images?.map((item, index) =>
                        // <div className="relative mx-4 h-full bg-yellow-400">dmnlknklnlknlnknlnlnlknlnnlnknlknklnlnklnnknlkln</div>

                        <div  key={index}  className = "relative h-full mx-2">
                            <div className = "absolute right-0 top-0 rounded-full">
                                <IconButton handleClick = {()=>setState({type:"DELETE_IMAGE_FORM", payload:item})}icon={<BiTrash className="text-2xl "/>}/>
                            </div>
                            <img style={{minWidth:200}} className="w-96 h-full rounded z-10 object-contain" src={`${process.env.REACT_APP_FILE_URL}/${item?.destination}-large.webp`} alt=" nnlnl"/>

                        </div>
                    )}
                </div>
                <div className="my-2 h-full">
                    <div className="flex flex-row w-full py-1 ">
                        <div className="flex flex-row justify-between items-start w-full pr-2 border-r ">
                            <div className="text-base font-medium">Пользователь</div>
                            <div>
                                {state.data.full_name}
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-start w-full px-2">
                            <div className="text-base font-medium">Номер телефона</div>
                            <div>
                                {state.data.phone}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row w-full py-1">
                        <div className="flex flex-row justify-between items-start w-full pr-2 border-r ">
                            <div className="text-base font-medium">Время добавления</div>
                            <div>
                                {state.data.created_at ?  formatDate(state.data.created_at) : null}
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-start w-full px-2">
                            <div className="text-base font-medium">Тип пользователя</div>
                            <div>
                                {state.data.owner_type}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row w-full py-1">
                        <div className="flex flex-row justify-between items-start w-full pr-2 border-r ">
                            <div className="text-base font-medium">Недвижимость</div>
                            <div>
                                {state.data.real_estate_name}
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-start w-full px-2">
                            <div className="text-base font-medium">Местоположение</div>
                            <div>
                                {state.data.location}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row w-full py-1">
                        <div className="flex flex-row justify-between items-start w-full pr-2 border-r">
                            <div className="text-base font-medium">Цена</div>
                            <div>
                                {state.data.price}
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-start w-full px-2">
                            <div className="text-base font-medium">Vip</div>
                            <div>
                                {state.data.vip}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative flex flex-col w-full -mt-1 max-h-40 overflow-y-auto">
                    <div className="text-base font-medium sticky top-0 bg-white">Спецификации</div>
                    {state.data?.specifications?.map((item, index) =>(
                        <div key={index} className="w-full flex flex-row justify-between items-start border-b px-2 text-sm">
                            <div className="font-normal ">
                                {item.name}:
                            </div>
                            <div className="">
                                {item?.values?.map((element, i) => (
                                    <div key={i}>
                                        {element.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-row py-2 h-100 ">
                    <div className="flex flex-col w-full relative mb-6 p-3">
                        <label>Описание на туркменском</label>
                        <textarea type="text" {...register("description_tm")} name="description_tm"
                            autoComplete="false"
                            className={`${errors.description_tm ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} px-3 shadow-inner h-100 text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2 `}
                            placeholder="Описание на туркменском"
                        />
                    </div>
                    <div className="flex flex-col w-full relative mb-6 p-2">
                        <label>Описание на русском</label>
                        <textarea type="text" {...register("description_ru")} name="description_ru"
                            autoComplete="false"
                            className={`${errors.description_ru ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} px-3 shadow-inner h-100 text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2 `}
                            placeholder="описание на русском"
                        />
                    </div>
                </div>
                <div className="flex flex-row relative px-4 w-full flex flex-row justify-between items-center">
                    <p className="mb-4 w-full">
                        <p>Действие</p>
                    <label id="q1" className = "w-1/2">
                        <input type = "radio"  name = "a" id="q1" value = {false} onChange = {(e)=>{setValue("is_active", e.target.value)}} /> 
                        <span className="ml-2 w-1/2">Отказать</span>
                    </label>
                    <label id="q2" className = "pl-20 w-1/2">
                        <input type = "radio" name = "a" id="q2" value = {true}  onChange = {(e)=>{setValue("is_active", e.target.value)}}/>  
                        <span className="ml-2 border-indigo ">Принять</span>
                    </label>
                    </p>
                    <p className="absolute bottom-0 left-0 -mb-4 text-xs font-medium text-red-400">
                        {errors.is_active?.message}
                    </p>         
                </div>
                <div className={` flex flex-col w-full relative mb-6 p-2 ${watch("is_active") === "true" || !watch("is_active") ? `hidden` : `flex`}`}>
                        <label>Комментарий</label>
                        <textarea type="text" {...register("comment")} name="comment"
                            autoComplete="false"
                            className={`${errors.comment ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} px-3 shadow-inner h-100 text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2 `}
                            placeholder="Комментарий"
                        />
                    </div>
                <div className = "pt-5 w-full px-10 py-1">
                    <button type = "submit" className="w-full px-10 flex remove-button-bg justify-center items-center  h-10 text-white transform ease-in-out duration-300 hover:scale-110 active:scale-100 font-semibold text-base rounded-full bg-green-500 hover:bg-green-400 active:bg-green-500 focus:outline-none shadow-md">
                            Подтвердить
                    </button>
                </div> 
            </div>
            : form === 'PUSH' ?
                <div>
                    <button type = "submit" className="w-full rounded-xl text-center py-3 bg-green-400 text-white focus:outline-none">
                            Подтвердить
                    </button>
                </div>
            : form === "remove" ?
                <div>
                    <button type = "submit" className="w-full rounded-xl text-center py-3 bg-green-400 text-white focus:outline-none">
                            Подтвердить
                    </button>
                </div>
            :
            <div>
                <div className="flex flex-row px-4 w-full flex flex-row justify-between items-center">
                    <p className="mb-4 w-full justify-beetwen">
                        <p className = "p-3">Выбрать тариф</p>
                    <label id="q1" className = "w-1/2">
                        <input type = "radio"  name = "a" id="q1"value = {3} onChange = {(e)=>{setValue("rate", 3)}} /> 
                        <span className="ml-2 w-1/2">3-х дневный</span>
                    </label>
                    <label id="q2" className = "pl-20 w-1/2">
                        <input type = "radio" name = "a" id="q2" value = {10}  onChange = {(e)=>{setValue("rate", 10)}}/>  
                        <span className="ml-2 border-indigo ">10-и дневный</span>
                    </label>
                    </p>              
                </div>
                <div className = "py-3 flex flex-col">
                    <label className = "pl-2 pb-3">Введите начальное число</label>
                    <input {...register("start_date")} type = "text" onFocus = {(e)=>{e.currentTarget.type="date"}} onBlur={(e)=>e.currentTarget.type="text"}  placeholder = "Введите начальное число" className = "ring-indigo-600 px-3 shadow-inner h-12 text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2"/>        
                </div>
                <div className = "pt-5 w-full px-1">
                    <button type = "submit" className="w-full rounded-xl text-center py-3 bg-green-400 text-white focus:outline-none">
                            Подтвердить
                    </button>
                </div> 
            </div>
            }
        </form>
        </ModalContainer>
    )
}

const today = new Date();

const schema = (form) => Yup.object().shape({
    description_ru: form === "watch" ? Yup.string().required("Обязательное поле").min(10) : Yup.string().nullable(true),
    description_tm: form === "watch" ? Yup.string().required("Обязательное поле").min(10) : Yup.string().nullable(true),
    is_active: form === "watch" ? Yup.boolean().required("Обязательное поле") : Yup.string().nullable(true),
    comment: form === "watch" ? Yup.string().ensure().when('is_active', {
        is:false,
        then:Yup.string().min(5).max(150).required()
    }) : Yup.string().nullable(true),
    rate: form === "watch" || form === "PUSH" || form === "remove" ? Yup.string().nullable(true) : Yup.number().required(),
    start_date: form === "watch" || form === "PUSH" || form === "remove" ? Yup.string().nullable(true) : Yup.date().required()
})
 
export default Form;