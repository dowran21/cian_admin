import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm, useFieldArray} from "react-hook-form";
import { get, post } from '../../application/middlewares/index';
import Loader  from '../../components/Loader';
import { useDispatch } from 'react-redux';
import ModalContainer from '../../components/ModalContainer';
import { useEffect, useReducer, useState } from 'react';
import toast from 'react-hot-toast';
import Switcher from '../../components/Switcher';
import IconButton from '../../components/IconButton';
import {IoMdAdd} from "@react-icons/all-files/io/IoMdAdd";
import {MdDeleteForever} from "@react-icons/all-files/md/MdDeleteForever";
import ImageUpload from '../../components/ImageUpload';
import Label from '../../components/Label';

function reducer(state, action) {
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
        case 'SET_SUBMIT_VISIBLE_LENGTH':
            return{
                ...state, submit_visible:action.payload
            }
        case 'REMOVE_ITEM':
            return{
                ...state, data:state.data.filter(item => item.spec_id !== action.payload.spec_id)
            }
        case 'ADD_ITEM':
            return{
                ...state, data:state.data.concat(action.payload)
            }
        case 'RESET_DATA':
            return{
                loading: false, data:[], submit_visible:0, 
            }
        default: return state;
    }
}
 
function Form({ visible, setCloseModal, values, token, addNewType, form, setUploadedImage, deleteCtypeData, updateTypeNames }) {

    const [state, setState] = useReducer(reducer, {
        loading: false, data:[], submit_visible:0, 
    });
    
    const { control, register, handleSubmit, formState: { errors }, setError, reset, setValue, clearErrors } = useForm({//
        resolver: yupResolver(schema(form))
    });

    const { fields, remove, update, append} = useFieldArray({//swap, move, insert, prepend, , 
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "active_type_specifications", // unique name for your Field Array
      keyName: "key", //default to "id", you can change the key name
    });

    const dispatch = useDispatch();

    useEffect(() =>{
        if(visible === true && (form === 'update')){
            dispatch(get({
                url:`api/admin/type/${values.id}`,
                token,
                action:(response) =>{
                    if(response.success){
                        setValue('active_type_specifications', response.data?.active_type_specifications?.length ? response.data?.active_type_specifications : []);
                        if(response.data?.active_type_specifications?.length){
                            setState({type:'SET_SUBMIT_VISIBLE_LENGTH', payload:response.data?.active_type_specifications?.length})
                        }
                        clearErrors(['active_type_specifications'])
                    }
                }
            }));
            dispatch(get({
                url:`api/admin/not-contained-spec/${values.id}`,
                token,
                action:(response) =>{
                    if(response.success){                        
                        setState({type:'SET_DATA', payload: response.data?.rows?.length > 0 ? response.data.rows : []})
                    }
                }
            }));
        }else{
            clearErrors(['active_type_specifications']);
            setState({type:'RESET_DATA'})
        }
        if(form === "update_type"){
            setValue("name_tm", values.name_tm)
            setValue("name_ru", values.name_ru)
        }
        // eslint-disable-next-line
    }, [visible]);

    const onSubmit = (data) => {
        console.log(data)
        setState({type:'SET_LOADING', payload:true});
        let active_type_specifications = [];
        data.active_type_specifications?.forEach(element => {
            if(!element.type_spec_id){
                active_type_specifications = active_type_specifications.concat({spec_id:element.spec_id, queue_position:element.queue_position});
            }
        });        
        if(form === "add_type"){
            dispatch(post({
                url: `api/admin/add-type`,
                data: {...data, categories},
                token,
                action: (response) =>{
                    if(response.success){
                        console.log(response);
                        addNewType(response.data.rows);
                        setCloseModal()
                        setState({type:'SET_LOADING', payload:false})
                        reset({active_type_specifications:[]});
                    }else{
                        setState({type:'SET_LOADING', payload:false})
                        toast.error("some error")
                    }
                }
            }))
        }else if(form === "update_type"){
            console.log("update form")
            dispatch(post({
                url:`api/admin/update-type/${values.type_id}`,
                data,
                token,
                action:(response) =>{
                    if(response.success){
                        updateTypeNames({type_id:values.type_id, name_tm:data.name_tm, name_ru:data.name_ru})
                        setCloseModal()
                        reset({})
                    }else{
                        toast.error("Неизвестная ошибка")
                        setCloseModal()
                    }
                }
            }))
        }else{
            dispatch(post({
                url:`api/admin/add-specifications-to-type/${values.id}`,
                data: active_type_specifications,
                token,
                action: (response) => {
                    if (response.success) {
                        setCloseModal()
                        setState({type:'SET_LOADING', payload:false})
                        reset({active_type_specifications:[]});
                        clearErrors(['active_type_specifications'])
                    } else {
                        if (response.message) {
                            if(response.error.status === 422 || response.error.status === 409){
                                Object.keys(response.message.error)?.forEach(key =>{
                                    setError(key, {
                                        type: "manual",
                                        message: response.message.error[key],
                                    })
                                });
                            }
                        }else{
                            toast.error('Неизвестная ошибка!')
                        }
                        setState({type:'SET_LOADING', payload:false})
                    }
                },
            }));
        }
    }
    const handleDeleteTypeSpecValue = (field, index, enabled) => {
        dispatch(post({
            url:`api/admin/activation-type-specification/${field.type_spec_id}`,
            token,
            data:{deleted: !enabled.value},
            action:(response)=>{
                if(response.success){
                    update(index, {...field, deleted: !enabled.value})
                }
                enabled.setLoading(false);
            }
        }))
    }
    const handleChangeQueuePosition = (field, index, value) => {
        dispatch(post({
            url:`api/admin/change-queue-position/${field.type_spec_id}`,
            token,
            data:{queue_position: value},
            action:(response)=>{
                if(response.success){
                    update(index, {...field, queue_position: value})
                }
            }
        }));
    }
    const [categories, setCategories] = useState([])
    const categoryChange = (value) =>{
        if(categories.includes(value)){
            setCategories(prev => prev.filter(it => it!==value))
        }else{
            console.log("i am in else")
            setCategories(prev => [...prev, value]);
        }
    }
    console.log(form)
    const deleteCtype = (id) =>{
        setState({type:"SET_LOADING",payload:true})
        dispatch(post({
            url:`api/admin/delete-ctype/${id}`,
            token,
            action:(response) =>{
                if(response.success){
                    deleteCtypeData(id)
                    setState({type:"SET_LOADING",payload:false})
                }else{
                    toast.error("Неизвестная ошибка")
                    setCloseModal()
                    setState({type:"SET_LOADING",payload:false})
                }
            }
        }))
    }
    
    return (
        <ModalContainer size={form === "add_location" ? "md" : "lg"} 
            setCloseModal={() => {
                setCloseModal();
                reset({is_required:false, is_multiple:false, active_type_specifications:[]});
                clearErrors('active_type_specifications')
            }} 
            visible={visible} 
            title={form !== 'add_type' ? `Форма добавления типа`:'Форма доб/изм спецификации типов'}
        >   
            {form === "delete_ctype" ?
            <div>
            <div className="flex flex-row justify-center  min-w-400 pb-6 pt-2 mt-6">
                <div className=" h-full flex flex-col w-full">
                    <div className="w-full flex flex-row justify-between items-center">
                        Тип Сделки: <span className="font-semibold ml-2">{values.name}</span>
                    </div>
                    <div className="w-full flex flex-row justify-between items-center">
                        Категория недвижимости: <span className="font-semibold ml-2">{values.main_type_name}</span>
                    </div>
                    <div className="w-full flex flex-row justify-between items-center">
                        Тип недвижимости: <span className="font-semibold ml-2">{values.name_ru}</span>
                    </div>
                </div>
            </div>
            <div className={` absolute bottom-0 -mb-9 w-full flex justify-center items-center`}>
                <button onClick = {()=>deleteCtype(values.id)} disabled={state.loading} className="w-40 flex remove-button-bg justify-center items-center px-4 h-10 text-white transform ease-in-out duration-300 hover:scale-110 active:scale-100 font-semibold text-base rounded-full bg-green-500 hover:bg-green-400 active:bg-green-500 focus:outline-none shadow-md">
                        {state.loading ?
                            <div className="w-12"><Loader size="sm" /></div>
                        :'Удалить'}
                </button>
            </div>
            </div>
            : 
            <form onSubmit={handleSubmit(onSubmit)} className=" w-full h-full pb-2 min-w-150 sm:min-w-400 md:min-w-150 lg:min-w-800">
               {form === 'update' ? 
               <div>
                    <div className="flex flex-row justify-center items-center w-full pb-6 pt-2 -mt-6">
                        <div className="w-5/12 h-full flex flex-col justify-center items-center">
                            <div className="w-full flex flex-row">
                                Тип Сделки: <span className="font-semibold ml-2">{values.name}</span>
                            </div>
                            <div className="w-full flex flex-row">
                                Категория недвижимости: <span className="font-semibold ml-2">{values.main_type_name}</span>
                            </div>
                            <div className="w-full flex flex-row">
                                Тип недвижимости: <span className="font-semibold ml-2">{values.name_ru}</span>
                            </div>
                        </div>
                        <div className="w-7/12">
                            <ImageUpload
                                visible={visible}
                                myDocument={values}
                                token={token}
                                setUploadedImage={setUploadedImage}
                                url={`/api/admin/add-image-to-type/${values.id}`}
                            />
                        </div>
                    </div>
                
               <div className="relative flex flex-row w-full mb-4 shadow-inner bg-gray-50 lg:h-96 lg:max-h-96 h-64 max-h-64">
                    <div className="relative w-1/2 flex flex-col justify-start items-start px-2 rounded-lg h-full  overflow-y-auto">
                        {state.data?.map((item, index) => {
                            return(
                                <div key={index} className={`${index % 2 === 0 ? 'bg-green-100' : 'bg-yellow-100'} w-full rounded-lg my-2 px-2 py-1 flex flex-row justify-between items-center`}>
                                    <Label>{item.name_ru}</Label>
                                    <IconButton handleClick={() => {
                                        append({...item, queue_position:fields.length + 1});
                                        setState({type:'REMOVE_ITEM', payload:item});
                                    }} icon={<IoMdAdd className="text-2xl "/>}/>
                                </div>
                            )
                        })}
                    </div>
                    <div className="w-1 h-full bg-blue-300 rounded"></div>
                    <div className={`${errors?.active_type_specifications?.message ? ' border-red-300 ring-red-100 border-2' : '' } relative w-1/2 flex flex-col justify-start items-start px-2  rounded-lg h-full  overflow-y-auto`}>
                        {fields.map((field, index) => {
                            return (
                                <div key={index} className={`${index % 2 === 0 ? 'bg-green-100' : 'bg-yellow-100'} w-full flex flex-col md:flex-row justify-center  lg:items-end my-2 px-2 rounded-md `}>
                                    <div  className={`w-full flex justify-start items-center md:h-full`}>
                                        <Label>{field.name_ru}</Label>
                                    </div>
                                    <div className="w-48 flex justify-center items-center mt-6 lg:mt-0">
                                        {field.type_spec_id ?
                                            <div className="w-full flex flex-row justify-between items-center">
                                                <select value={field.queue_position} onChange={(e) => handleChangeQueuePosition(field, index, e.target.value)} 
                                                    className={`${errors?.active_type_specifications?.[index]?.queue_position?.message ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} ml-2 px-3 shadow-inner h-10 w-16 text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2 `}>
                                                    <option value={0}>0</option>
                                                    {fields.map((item, index) => <option key={index} value={index + 1}>{index + 1}</option>)}
                                                </select>
                                                <Switcher item_id={field.id} status={!field.deleted} handleStatus={(enabled) => handleDeleteTypeSpecValue(field, index, enabled)}/>
                                            </div>
                                        :  
                                        <div className="w-full flex flex-row justify-between items-center">
                                            <select {...register(`active_type_specifications.${index}.queue_position`)} 
                                                className={`${errors?.active_type_specifications?.[index]?.queue_position?.message ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} ml-2 px-3 shadow-inner h-10 my-1 w-16 text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2 `}>
                                                {fields.map((item, index) => <option key={index} value={index + 1}>{index + 1}</option>)}
                                            </select>
                                            <IconButton handleClick={() => {
                                                setState({type:'ADD_ITEM', payload:{spec_id:field.spec_id, name_ru:field.name_ru, name_tm:field.name_tm, absolute_name:field.absolute_name }})
                                                remove(index);
                                            }} icon={<MdDeleteForever className="text-2xl "/>}/>
                                        </div>
                                        }
                                    </div>
                                </div>
                        )})}
                    </div>
                    <p className="absolute bottom-0 -mb-4 right-0 text-xs font-medium text-red-400">
                        {errors?.active_type_specifications?.message}
                    </p>
                </div>
                </div>
                : form === "add_type" ?
                <div className = "relative min-w-300 text-base justify-center items-beetwen p-30">
                    <p className="mb-4">
                        <p>Вид недвижимости</p>
                        <label id="q1">
                    <input type = "radio" name = "a" id="q1"value = {1} onChange = {(e)=>{setValue("main_type_id", 1)}} /> 
                    <span className="ml-2">Жилая недвижимость</span>
                    </label>
                    <label id="q2" className="ml-6">
                    <input type = "radio" name = "a" id="q2" value = {2} onChange = {(e)=>{setValue("main_type_id", 2)}}/>  
                    <span className="ml-2">Коммерческая недвижимость</span>
                    </label>
                    </p>
                    <div className = "flex flex-col">
                         <div> 
                            <label>Название на туркменском</label>
                            <input {...register("name_tm")} autoComplete="false"
                                className={`${errors.name_tm ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} p-3 shadow-inner h-10 w-full text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2`}
                                placeholder="на туркменском"
                            />
                            <p className="absolute bottom-0 left-0 -mb-4 text-xs font-medium text-red-400">
                                {errors.name_tm?.message}
                            </p>
                        </div>
                        <div className="mt-4">
                            <label>Название на русском</label>
                            <input {...register("name_ru")} autoComplete="false"
                                className={`${errors.name_ru ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} p-3 shadow-inner h-10 w-full text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2`}
                                placeholder="на русском"
                            />
                            <p className="absolute bottom-0 left-0 -mb-4 text-xs font-medium text-red-400">
                                {errors.name_ru?.message}
                            </p>
                        </div>
                    </div>
                    <p className="mt-4">Тип сделки</p>
                    
                    <div className = "relative min-w-300 text-base justify-center items-beetwen p-30">
                        <label className="mr-6">
                        <input type = "checkbox" name = "category" value = {1} onChange = {()=>{categoryChange(1)}}/>
                            <span className="ml-2">Продажа</span>
                        </label>
                        <label>
                        <input type = "checkbox" name = "category" value = {2} onChange = {()=>{categoryChange(2)}}/>
                        <span className="ml-2">Аренда</span>
                        </label>
                    </div>
                </div>
                : 
                <div className = "flex flex-col">
                    <div> 
                        <label>Название на туркменском</label>
                        <input {...register("name_tm")} autoComplete="false"
                            className={`${errors.name_tm ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} p-3 shadow-inner h-10 w-full text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2`}
                            placeholder="на туркменском"
                        />
                        <p className="absolute bottom-0 left-0 -mb-4 text-xs font-medium text-red-400">
                            {errors.name_tm?.message}
                        </p>
                    </div>
                    <div className="mt-4">
                        <label>Название на русском</label>
                        <input {...register("name_ru")} autoComplete="false"
                            className={`${errors.name_ru ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} p-3 shadow-inner h-10 w-full text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2`}
                            placeholder="на русском"
                        />
                        <p className="absolute bottom-0 left-0 -mb-4 text-xs font-medium text-red-400">
                            {errors.name_ru?.message}
                        </p>
                    </div>
                </div>
                }
                <div className={`${form === 'create' ? '' : form === 'update' && fields.length === state.submit_visible ? 'hidden' : ''} absolute bottom-0 -mb-9 w-full flex justify-center items-center`}>
                    <button type="submit" disabled={state.loading} className="w-40 flex remove-button-bg justify-center items-center px-4 h-10 text-white transform ease-in-out duration-300 hover:scale-110 active:scale-100 font-semibold text-base rounded-full bg-green-500 hover:bg-green-400 active:bg-green-500 focus:outline-none shadow-md">
                            {state.loading ?
                                <div className="w-12"><Loader size="sm" /></div>
                            :'Добавить/Обновить'}
                    </button>
                </div>
            </form>
        }
        </ModalContainer>
    )
}

  

const schema = (form) =>  Yup.object().shape({
    active_type_specifications:form === "update" ? Yup.array().of(
        Yup.object().shape({
            spec_id:Yup.number().required('Обязательное поле'),
            queue_position:Yup.string().required('Обязательное поле')
        })
    ).required("Значения обязательны")
    .min(1, "Минимум необходимо добавить одно значение") : Yup.array().nullable(true),
    name_tm: form === "add_type" || form === "update_type" ? Yup.string().min(3).max(50).required() : Yup.string().nullable(true),
    name_ru: form === "add_type" || form === "update_type" ? Yup.string().min(3).max(50).required() : Yup.string().nullable(true),
    main_type_id: form === "add_type" ? Yup.number().min(1).max(2).required() : Yup.number().nullable(true)
    
});
 
 
export default Form;


/* <div className="relative w-full mb-2 lg:mb-0 lg:mr-2">
    <label>На туркменском</label>
    <input disabled={true} type="text" {...register(`active_type_specifications.${index}.name_tm`)} 
        autoComplete="false"
        className={`${errors?.active_type_specifications?.[index]?.name_tm?.message ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} px-3 shadow-inner mr-2 h-10 w-full text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2 `}
        placeholder="напр. Kerpiç"
    />
    <p className="absolute bottom-0 left-0 -mb-4 text-xs font-medium text-red-400">
        {errors?.active_type_specifications?.[index]?.name_tm?.message}
    </p>
</div> */