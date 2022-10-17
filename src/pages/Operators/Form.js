import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm } from "react-hook-form";
import { get, post } from '../../application/middlewares/index';
import Loader  from '../../components/Loader';
import { useDispatch } from 'react-redux';
import ModalContainer from '../../components/ModalContainer';
// import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { RiLockPasswordLine } from "@react-icons/all-files/ri/RiLockPasswordLine";
import { MdVisibility } from "@react-icons/all-files/md/MdVisibility";
import toast from 'react-hot-toast';
import { data } from 'autoprefixer';
import Label from '../../components/Label';
import {IoMdAdd} from "@react-icons/all-files/io/IoMdAdd";
import IconButton from '../../components/IconButton';
import {MdDeleteForever} from "@react-icons/all-files/md/MdDeleteForever";


 
function Form({ visible, setCloseModal, values, token, addOperator, form, updateOperator}) {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false)
    const { register, handleSubmit, formState: { errors }, setError, reset, setValue } = useForm({//
        resolver: yupResolver(schema(form))
    });
    useEffect(() =>{
        if(visible === true && (form === 'update' || form === 'change_password')){
            Object.keys(values).forEach(key =>{
                setValue(key, values[key])
            })
        }// eslint-disable-next-line
    }, [visible]);
    const dispatch = useDispatch()

    const [locations, setLocations] = useState([]);
    const [notlocations, setNotLocations] = useState([]);
    const [addLocations, setAddLocations] = useState([]);

    const onSubmit = (data) => {
// import toast from 'react-hot-toast';
        setLoading(true)
        dispatch(post({
            url: form === 'create' ? '/api/admin/add-operator' : form === 'update' ? `api/admin/update-operator/${data.id}` : form === 'change_password' ? `api/admin/change-operator-password/${data.id}` : form === "add_location" ? `api/admin/add-operator-locations/${values.id}`:'', 
            data: form === 'create' ? data : form === 'update' ? {...data, password:undefined} : form === 'add_location' ? {locations:addLocations}:{password:data.password},
            token,
            action: (response) => {
                console.log(response)
                if (response.success) {
                    if(form === 'create'){
                        addOperator(response.data.rows);   
                    }else if(form === 'update'){
                        updateOperator(response.data.rows)
                    }else{
                        setCloseModal()
                    }
                    setLoading(false);
                    reset({})
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
                    setLoading(false)
                }
            },
        }));
        setAddLocations([])
    }
    // console.log(values)
   
    useEffect(()=>{
        // console.log("Hello i am in useEffect")
        setAddLocations([])
        if (form === "add_location"){
            console.log("Hello i am in if")
            dispatch(get({
                url: `api/admin/get-operator-locations/${values.id}`,
                data: {},
                token,
                action: (response) =>{
                    // console.log(response)
                    if(response.success){   
                        setLocations(response.data.rows)
                    }else{
                        toast.error('Неизвестная ошибка')
                    }
                }
            }))
            dispatch(get({
                url: `api/admin/get-not-operator-locations/${values.id}`,
                data,
                token,
                action: (response) =>{
                    if(response.success){
                        setNotLocations(response.data.rows);
                    }else{
                        toast.error('Неизвестная ошибка')
                    }
                }
            }))
        }
    }, [form])

    const removeLocationFromOperator = (item)=>{
        setLoading(true)
        console.log(item)
        dispatch(post({
            url: `api/admin/remove-location-from-operator/${item.op_loc_id}`,
            data:{},
            token,
            action: (response) =>{
                if(response.success){
                    setLocations(prev => prev.filter(it => it.id !== item.id));
                    setNotLocations([...notlocations, item]);
                    setLoading(false)
                }else{
                    toast.error("Неизвестная ошибка")
                    setLoading(false)
                }
            }
        }))
    }

    const removeFromAddLocation = (item) =>{
        setAddLocations(prev => prev.filter(it => it.id !== item.id));
        setNotLocations([...notlocations, item]);
    }

    return (
        <ModalContainer size="lg" 
            setCloseModal={() => {
                setCloseModal();
                reset({})
            }} 
            visible={visible} 
            title={form === 'create' ? 'Форма добавления' : form === 'update' ? 'Форма изменения' : form === 'change_password' ? 'Форма изменения пароля' : form === "add_location" ? 'Форма добавления локации' : 'Форма'}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="w-full pb-12">

                {form === "add_location" ?

                <div className="relative min-w-500 flex flex-row w-full mb-4 shadow-inner bg-gray-50 lg:h-96 lg:max-h-96 h-64 max-h-64">
                    
                    <div className="relative w-1/2 flex flex-col justify-start items-start px-2 rounded-lg h-full  overflow-y-auto">
                        {notlocations?.map((item, index) => {
                            return(
                                <div key={index} className={`${index % 2 === 0 ? 'bg-green-100' : 'bg-yellow-100'} w-full rounded-lg my-2 px-2 py-1 flex flex-row justify-between items-center`}>
                                    <Label>{item.translation}</Label>
                                    <IconButton handleClick = {()=>{
                                        setAddLocations([...addLocations, item]);
                                        setNotLocations(prev => prev.filter(it => it.id !== item.id));
                                        console.log(locations)
                                        }}  icon={<IoMdAdd className="text-2xl "/>}/>
                                </div>
                            )
                        })}
                    </div>
                    <div className="w-1 h-full bg-blue-300 rounded"></div>
                        <div className="relative w-1/2 flex flex-col justify-start items-start px-2 rounded-lg h-full  overflow-y-auto">
                            {locations?.map((item, index) => {
                                return(
                                    <div key={index} className={`${index % 2 === 0 ? 'bg-green-100' : 'bg-yellow-100'} w-full rounded-lg my-2 px-2 py-1 flex flex-row justify-between items-center`}>
                                        <Label>{item.translation}</Label>
                                        <IconButton handleClick = {()=>removeLocationFromOperator(item)} icon={<MdDeleteForever className="text-2xl "/>}/>
                                    </div>
                                )
                            })}
                            {addLocations?.map((item, index) => {
                                return(
                                    <div key={index} className={`${index % 2 === 0 ? 'bg-green-100' : 'bg-yellow-100'} w-full rounded-lg my-2 px-2 py-1 flex flex-row justify-between items-center`}>
                                        <Label>{item.translation}</Label>
                                        <IconButton handleClick = {()=>removeFromAddLocation(item)} icon={<MdDeleteForever className="text-2xl "/>}/>
                                    </div>
                                )
                            })}
                        </div>
                </div> 
                
                :
                <div>
                <div className="relative w-full mb-6">
                    <label>Полное Имя</label>
                    <input  disabled={form === 'change_password'} type="text" {...register("full_name")}
                        autoComplete="false"
                        className={`${errors.full_name ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} px-3 shadow-inner h-10 w-full text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2 `}
                        placeholder="напр. Довран Джумакулыев"
                    />
                    <p className="absolute bottom-0 left-0 -mb-4 text-xs font-medium text-red-400">
                        {errors.full_name?.message}
                    </p>
                </div>
                <div className="relative w-full mb-6">
                    <label>Телефон</label>
                    <input disabled={form === 'change_password'} type="tel" {...register("phone")}
                        autoComplete="false"
                        className={`${errors.phone ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} pl-12 shadow-inner h-10 w-full text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2 `}
                        placeholder="6xxxxxxx"
                    />
                    <div className="absolute opacity-80 top-6 z-10 px-1 py-2 text-base font-medium text-gray-600 rounded-l h-10">
                        +993
                    </div>
                    <p className="absolute bottom-0 left-0 -mb-4 text-xs font-medium text-red-400">
                        {errors.phone?.message}
                    </p>
                </div>
                <div className="relative w-full mb-6">
                    <label>Электронная почта</label>
                    <input disabled={form === 'change_password'} type="email" {...register("email")}
                        autoComplete={"false"}
                        className={`${errors.email ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} px-3 shadow-inner h-10 w-full text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2 `}
                        placeholder="напр. dovran@takyk.com"
                    />
                    <p className="absolute bottom-0 left-0 -mb-4 text-xs font-medium text-red-400">
                        {errors.email?.message}
                    </p>
                </div>
                {form === 'update' ? 
                    null
                    :
                    <div className="relative w-full">
                        <label >Пароль</label>
                        <input {...register("password")} autoComplete="false"
                            type={showPassword ? 'text' : 'password'}
                            className={`${errors.password ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} pl-12 shadow-inner h-10 w-full text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2`}
                            placeholder="********"
                        />
                        <RiLockPasswordLine className="absolute text-3xl top-7 left-4 w-6 opacity-70"/>
                        <MdVisibility onClick={() => setShowPassword(!showPassword)} className={`${showPassword ? 'text-blue-500' : 'text-gray-500'} absolute text-2xl top-8 cursor-pointer right-4 w-6 opacity-70`}/>

                        <p className="absolute bottom-0 left-0 -mb-4 text-xs font-medium text-red-400">
                            {errors.password?.message}
                        </p>
                    </div>
                }
                </div>
            }
                <div className="w-full flex justify-center items-center absolute -bottom-6">
                    {(form === 'add_location' && addLocations.length === 0) ?
                    
                    ``    
                    :
                    <button type="submit" disabled={loading} className="w-40 flex remove-button-bg justify-center items-center px-4 h-10 text-white transform ease-in-out duration-300 hover:scale-110 active:scale-100 font-semibold text-base rounded-full bg-green-500 hover:bg-green-400 active:bg-green-500 focus:outline-none shadow-md">
                        {loading ?
                            <div className="w-12"><Loader size="sm" /></div>
                        : form === 'add_location' ? "Добавить локацию" :
                           `${Object.values(values)?.length > 0 ? 'Изменить' : 'Добавить'}` 
                        }
                    </button>
                }
                </div>
 
            </form>
        </ModalContainer>
    )
}

const schema = (form) =>  Yup.object().shape({
    full_name: form === 'add_location' ? Yup.string().nullable(true) : Yup.string().required('Обязательное поле').min(3, 'Минимум 3 значений').max(50, 'Минимум 50 значений'),
    phone: form === 'add_location' ? Yup.string().nullable(true) : Yup.string().min(8, "Минимум 8 значений").max(8, "Максимум 8 значений")
        .required("Обязательное поле")
        .matches(
            /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/,
            "Неверный формат номер телефона"
        ),
    email: form === 'add_location' ? Yup.string().nullable(true) : Yup.string().email('Неверный формат электронной почты').max(50, "Максимум 50 значений").required('Обязательное поле'),
    password: form === 'add_location' ? Yup.string().nullable(true) : form === 'update' ? Yup.string().nullable(true)
    
    :  Yup.string().min(8, "Минимум 8 значений").max(30, "Максимум 30 значений").required('Обязательное поле')
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
            "Необходимо хотя бы одна буква или одна цифра"
        ),
});
 
 
export default Form;