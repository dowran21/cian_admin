import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm, useFieldArray, Controller} from "react-hook-form";
import { get, post } from '../../application/middlewares/index';
import Loader  from '../../components/Loader';
import { useDispatch } from 'react-redux';
import ModalContainer from '../../components/ModalContainer';
// import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Switcher from '../../components/Switcher';
import Switch from "react-switch";
import IconButton from '../../components/IconButton';
import {IoMdAdd} from "@react-icons/all-files/io/IoMdAdd";
import {MdDeleteForever} from "@react-icons/all-files/md/MdDeleteForever";
import BgLoader from '../../components/BgLoader';

 
function Form({ visible, setCloseModal, values, token, addSpecification, form, setUpdateSpec, deleteSpec}) {
    const [submit_visible, setSubmitVisible] = useState(0)

    const [loading, setLoading] = useState(false);
    const { control, register, handleSubmit, formState: { errors }, setError, reset, setValue, clearErrors } = useForm({//
        resolver: yupResolver(schema),
        defaultValues:{is_required:false, is_multiple:false, ...values}
    });

    const { fields, append, remove, update} = useFieldArray({//swap, move, insert, prepend, 
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "value_translations", // unique name for your Field Array
      keyName: "key", //default to "id", you can change the key name
    });

    const dispatch = useDispatch();
   
    useEffect(() =>{
        if(visible === true && (form === 'update' || form==="delete")){
            Object.keys(values).forEach(key =>{
                setValue(key, values[key])
            });
            dispatch(get({
                url:`api/admin/get-specification/${values.id}`,
                token,
                action:(response) =>{
                    if(response.success){
                        setValue('value_translations', response.data.rows);
                        setSubmitVisible(response.data.rows?.length);
                        clearErrors(['value_translations'])
                    }
                }
            }))
        }else{
            clearErrors(['value_translations'])
        }// eslint-disable-next-line
        if(!visible){
            reset({});
            setLoading(false);
            
        }
    }, [visible]);
    const onSubmit = (data) => {
        console.log("I am in submit")
        setLoading(true)
        let new_data = null;
        let url = ''
        if(form === 'create'){
            new_data = {...data, value_translations: data.value_translations?.map(item => ({name_ru:item.name_ru, name_tm:item.name_tm}))};
            url = '/api/admin/add-specification'
        }else{
            url = `api/admin/add-spec-val/${data.id}`;
            let value_translations = [];
            data.value_translations.forEach(element => {
                if(!element.id){
                    value_translations = value_translations.concat({name_ru:element.name_ru, name_tm:element.name_tm});
                }
            });
            new_data = {value_translations}
        }
        if (form === "update"){
            dispatch(post({
                url:`api/admin/update-specification/${data.id}`,
                data:{"is_required":data.is_required, "is_multiple":data.is_multiple, "translation_ru":data.translation_ru, "translation_tm":data.translation_tm},
                token,
                action: (response) =>{
                    if(response.success){
                        toast.success("Hey i congratulate you")
                        setCloseModal()
                        setUpdateSpec({"is_required":data.is_required, "is_multiple":data.is_multiple, "translation_ru":data.translation_ru, "translation_tm":data.translation_tm, id:data.id})
                        setLoading(false);
                        reset({is_required:false, is_multiple:false, value_translations:[]});
                        clearErrors(['value_translations'])
                    }else{
                        toast.error("Неизвестная ошибка")
                        setCloseModal()
                        setLoading(false);
                        reset({is_required:false, is_multiple:false, value_translations:[]});
                        clearErrors(['value_translations'])
                    }
                }
            }))
        }
        if(new_data.value_translations.length && form === 'update'){
            console.log("I am in if")
            dispatch(post({
                url,
                data: new_data,
                token,
                action: (response) => {
                    if (response.success) {
                        if(form === 'create'){
                            addSpecification(response.data.rows);   
                        }else if(form === 'update'){
                            setCloseModal()
                        }else{
                            setCloseModal()
                        }
                        setLoading(false);
                        reset({is_required:false, is_multiple:false, value_translations:[]});
                        clearErrors(['value_translations'])
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
        }
        if(form === "create"){
            dispatch(post({
                url,
                data: new_data,
                token,
                action: (response) => {
                    if (response.success) {
                        if(form === 'create'){
                            addSpecification(response.data.rows);   
                        }else if(form === 'update'){
                            setCloseModal()
                        }else{
                            setCloseModal()
                        }
                        setLoading(false);
                        reset({is_required:false, is_multiple:false, value_translations:[]});
                        clearErrors(['value_translations'])
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
        }
    }
    const handleEnableSpecValue = (field, index, enabled) => {
        dispatch(post({
            url:`api/admin/disable-enable-spec-val/${field.id}`,
            token,
            data:{enable: enabled.value},
            action:(response)=>{
                if(response.success){
                    update(index, {...field, enable: enabled.value})
                }
                enabled.setLoading(false);
            }
        }))
    }
    const deleteSpecValue = (id, index) =>{
        dispatch(post({
            url:`api/admin/delete-spec-value/${id}`,
            token,
            action : (response) =>{
                if(response.success){
                    remove(index);
                    toast.success("Вы удалили значение!")
                }else{
                    toast.error("Неизвестная ошибка")
                }
            }
        }))
    }
    const deleteSpecification =  () =>{
        setLoading(true)
        dispatch(post({
            url:`api/admin/delete-specification/${values.id}`,
            token,
            action: (response) =>{
                if(response.success){
                    deleteSpec(values.id)
                    setCloseModal()
                    reset({})
                    toast.success("Вы удалили спецификацию")
                }else{
                    toast.error("неизвестная ошибка")
                }
            }
        }))
        setLoading(false)
    }
    return (
        <ModalContainer size="md" 
            setCloseModal={() => {
                setCloseModal();
                reset({is_required:false, is_multiple:false, value_translations:[]});
                clearErrors('value_translations')
            }} 
            visible={visible} 
            title={form === 'create' ? 'Форма добавления' : form === 'update' ? 'Форма доб/изм величин спецификаций' : form === 'change_password' ? 'Форма изменения пароля' : 'Форма'}
        >
            <form onSubmit={handleSubmit(onSubmit)} className=" w-full h-full pb-2">
                {/* */}
                <div className="flex flex-col lg:flex-row w-full px-2">
                    <div className="relative w-full mb-6 lg:mr-2">
                        <label>На туркменском</label>
                        <input type="text" {...register("translation_tm")}
                            autoComplete="false"
                            className={`${errors.translation_tm ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} px-3 shadow-inner h-10 w-full text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2 `}
                            placeholder="напр. Gurluşyň görnüşi"
                        />
                        <p className="absolute bottom-0 left-0 -mb-4 text-xs font-medium text-red-400">
                            {errors.translation_tm?.message}
                        </p>
                    </div>
                    <div className="relative w-full mb-6">
                        <label>На русском</label>
                        <input type="text" {...register("translation_ru")}
                            autoComplete="false"
                            className={`${errors.translation_ru ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} px-3 shadow-inner h-10 w-full text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2 `}
                            placeholder="напр. Виды строения"
                        />
                        <p className="absolute bottom-0 left-0 -mb-4 text-xs font-medium text-red-400">
                            {errors.translation_ru?.message}
                        </p>
                    </div>
                </div>
                <div className="flex flex-row w-full  justify-end items-center px-2">
                    <div className="relative w-full flex flex-row justify-start items-center mb-2 lg:mr-2">
                        <label className="mr-2">Обьязательно</label>
                        <Controller
                            control={control}
                            name="is_required"
                            render={({
                                field: { onChange, value }
                            }) => (
                                <Switch
                                    onChange={onChange}
                                    checked={value}
                                    checkedIcon={false}
                                    onColor="#34D399"
                                    height={18}
                                    width={37}
                                />
                            )}
                        />
                        <p className="absolute bottom-0 left-0 -mb-4 text-xs font-medium text-red-400">
                            {errors.is_required?.message}
                        </p>
                    </div>
                    <div className="relative w-full flex flex-row justify-start items-center mb-2 px-2">
                        <label className="mr-2">Несколько</label>
                        <Controller
                            control={control}
                            name="is_multiple"
                            render={({
                                field: { onChange, value }
                            }) => (
                                <Switch
                                    onChange={onChange}
                                    checked={value}
                                    checkedIcon={false}
                                    onColor="#34D399"
                                    height={18}
                                    width={37}
                                />
                            )}
                        />
                        <p className="absolute bottom-0 left-0 text-xs font-medium text-red-400">
                            {errors.is_multiple?.message}
                        </p>
                    </div>
                </div>
                {form === "delete" ? 
                    <>
                    <div className = "flex justify-center items-center py-2">
                        <p className = "text-2xl text-bold">Вы точно хотите удалить спецификацию?</p>
                    </div>
                    <div className=" flex flex-row justify-center items-center p-3 ">
                <div className = "p-2">
                <button onClick = {()=>setCloseModal()} className="min-w-100 flex remove-button-bg justify-center items-center px-10 h-10 text-white transform ease-in-out duration-300 hover:scale-110 active:scale-100 font-semibold text-base rounded-full bg-green-500 hover:bg-green-400 active:bg-green-500 focus:outline-none shadow-md">
                    {loading 
                            ?
                            <BgLoader loading = {loading}/>
                            :
                            <div>Нет</div>
                        }
                </button>
                </div>
                <div className = "p-2">
                <button onClick = {()=>deleteSpecification()} className="min-w-100 flex remove-button-bg justify-center items-center px-10 h-10 text-white transform ease-in-out duration-300 hover:scale-110 active:scale-100 font-semibold text-base rounded-full bg-red-500 hover:bg-red-400 active:bg-red-500 focus:outline-none shadow-md">
                    {loading 
                            ?
                            <BgLoader loading = {loading}/>
                            :
                            <div>Да</div>
                        }
                </button>
                </div>
            </div>
                    </>
                    :    
                    <>
                <div className="w-full flex justify-between items-end mb-2 px-2">
                    <div>Значения</div>
                    <IconButton handleClick={append} icon={<IoMdAdd className="text-2xl "/>}/>
                </div>
                
            
               <div className="relative w-full mb-4">
                    <div style={{minWidth:450}} className={`${errors?.value_translations?.message ? ' border-red-300 ring-red-100 border-2' : '' } relative w-full flex flex-col justify-start items-start px-2  rounded-lg lg:h-96 lg:max-h-96 h-64 max-h-64 overflow-y-auto p-4 shadow-inner bg-gray-50`}>
                        {fields.map((field, index) => {
                            return (
                                <div key={index} className={`${index % 2 === 0 ? 'bg-green-100' : 'bg-yellow-100'} w-full flex flex-row items-start lg:items-end my-2 px-2 pt-1 pb-5 rounded-md `}>
                                    <div  className={`w-full flex flex-col lg:flex-row items-end`}>
                                        <div className="relative w-full mb-2 lg:mb-0 lg:mr-2">
                                            <label>На туркменском</label>
                                            <input disabled={form === 'update' && field.id} type="text" {...register(`value_translations.${index}.name_tm`)} 
                                                autoComplete="false"
                                                className={`${errors?.value_translations?.[index]?.name_tm?.message ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} px-3 shadow-inner mr-2 h-10 w-full text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2 `}
                                                placeholder="напр. Kerpiç"
                                            />
                                            <p className="absolute bottom-0 left-0 -mb-4 text-xs font-medium text-red-400">
                                                {errors?.value_translations?.[index]?.name_tm?.message}
                                            </p>
                                        </div>
                                        <div className="relative w-full">
                                            <label>На русском</label>
                                            <input disabled={form === 'update' && field.id} type="text" {...register(`value_translations.${index}.name_ru`)} 
                                                autoComplete="false"
                                                className={`${errors?.value_translations?.[index]?.name_ru?.message ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} px-3 shadow-inner h-10 w-full text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2 `}
                                                placeholder="напр. Керпич"
                                            />
                                            <p className="absolute bottom-0 left-0 -mb-4 text-xs font-medium text-red-400">
                                                {errors?.value_translations?.[index]?.name_ru?.message}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-12 mt-6 lg:mt-0">
                                        {field.id ? 
                                        <div className = "flex justify-center items-center">
                                            {/* <Switcher item_id={field.id} status={field.enable} handleStatus={(enabled) => handleEnableSpecValue(field, index, enabled)}/> */}
                                            <IconButton handleClick={() => deleteSpecValue(field.id, index)} icon={<MdDeleteForever className="text-2xl "/>}/>
                                        </div>
                                        :  
                                            <IconButton handleClick={() => remove(index)} icon={<MdDeleteForever className="text-2xl "/>}/>
                                        }
                                    </div>
                                </div>
                        )})}
                    </div>
                    <p className="absolute bottom-0 -mb-4 left-0 text-xs font-medium text-red-400">
                        {errors?.value_translations?.message}
                    </p>
                </div>
                </>
                }
                {form !== "delete" && 
                <div className={` absolute bottom-0 -mb-9 w-full flex justify-center items-center`}>
                    <button type="submit" disabled={loading} className="w-40 flex remove-button-bg justify-center items-center px-4 h-10 text-white transform ease-in-out duration-300 hover:scale-110 active:scale-100 font-semibold text-base rounded-full bg-green-500 hover:bg-green-400 active:bg-green-500 focus:outline-none shadow-md">
                            {loading ?
                                <div className="w-12"><Loader size="sm" /></div>
                            :<>{form === "add" ? `Добавить` : `Обновить`}</>}
                    </button>
                </div>
                }
            </form>
        </ModalContainer>
    )
}

const schema =  Yup.object().shape({
    is_required: Yup.bool().required(),
    is_multiple: Yup.bool().required(),
    translation_tm:Yup.string().required('Обязательное поле').min(3, 'Минимум 3 значений').max(50, 'Минимум 50 значений'),
    translation_ru:Yup.string().required('Обязательное поле').min(3, 'Минимум 3 значений').max(50, 'Минимум 50 значений'),
    value_translations:Yup.array().of(
        Yup.object().shape({
        name_tm:Yup.string().required('Обязательное поле').min(1, 'Минимум 1 значений').max(50, 'Минимум 50 значений'),
        name_ru:Yup.string().required('Обязательное поле').min(1, 'Минимум 1 значений').max(50, 'Минимум 50 значений')
      })
    ).required("Значения обязательны")
    .min(1, "Минимум необходимо добавить одно значение")
    
});
 
 
export default Form;