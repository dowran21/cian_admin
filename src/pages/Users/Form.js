import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm } from "react-hook-form";
import { post } from '../../application/middlewares/index';
import Loader  from '../../components/Loader';
import { useDispatch } from 'react-redux';
import ModalContainer from '../../components/ModalContainer';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

 
function Form({ visible, setCloseModal, token, addPermission, values, form, deleteUserData, deactivationUser}) {
    const [loading, setLoading] = useState(false);
    console.log(values)
    const {  register, handleSubmit, formState: { errors }, setError, reset } = useForm({//
        resolver: yupResolver(schema(form)),
        
    });
    
    // useEffect(() =>{
        
    // }, [visible]);
    const dispatch = useDispatch()
    const onSubmit = (data) => {
        setLoading(true)
        dispatch(post({
            url: form === 'deactivation'? `api/admin/change-activation/${values.id}`: `api/admin/give-user-permission/${values.id}`, 
            data: form === 'deactivation' ? {...data, is_active:false} :data,
            action: (response) => {
                console.log(response)
                if (response.success) {
                    console.log(response.data)
                    if(form==="deactivation"){
                        deactivationUser({comment:data.comment, id:values.id})
                    }else{
                        addPermission(response.data?.rows);   
                    }
                    setLoading(false);
                    reset({});
                    setCloseModal()
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
            token
        }));
    }
    const DeleteUser = () =>{
        dispatch(post({
            url: `api/admin/delete-user/${values}`,
            token,
            action: (response) =>{
                if(response.success){
                    deleteUserData(values)
                    setCloseModal()
                }
            }
        }))
    }
    return (
        <ModalContainer size="lg"
            setCloseModal={() => {
            setCloseModal();
            reset({})
        }} 
        visible={visible} 
        title={form==="delete"?`Удаление`: form === "deactivation" ? `Деактивация` : 'Добавление разрешения'}
     >
         {form === "delete" ? 
             <div className = "flex flex-row">
                 <button className="w-1/2 h-12 flex remove-button-bg justify-center items-center px-4 h-15 text-white transform ease-in-out duration-300 hover:scale-110 active:scale-100 font-semibold text-base rounded-full bg-green-500 hover:bg-green-400 active:bg-green-500 focus:outline-none shadow-md">
                        Отменить
                 </button>
                 <button onClick = {DeleteUser} className="w-1/2 h-12 flex remove-button-bg justify-center items-center px-4 h-15 text-white transform ease-in-out duration-300 hover:scale-110 active:scale-100 font-semibold text-base rounded-full bg-red-500 hover:bg-red-400 active:bg-red-500 focus:outline-none shadow-md">
                    Удалить
                 </button>
             </div>
             :
            <form onSubmit = {handleSubmit(onSubmit)} className="w-full pb-12 min-w-200">
            {form==="deactivation" ?
            <>
            <div className="flex flex-col relative mb-6 p-3 min-w-400">
                        <label>Комментарий</label>
                        <textarea type="text" {...register("comment")} name="comment"
                            autoComplete="false"
                            className={`${errors.comment ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} px-3 shadow-inner w-full h-24 text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2 `}
                            placeholder="Комментарий (мимнимум 5, максимум 150 символов)"
                        />
                        <p className="absolute bottom-0 left-0 -mb-4 text-xs font-medium text-red-400">
                            {errors.comment?.message}
                        </p>
                    </div>
            </>
            :
            <>
            <div className="relative w-full mb-6">
                        <label>Введите начальное число</label>
                        <input  type="date" {...register("start_date")}
                            placeholder={`напр. `} 

                            autoComplete="false"
                            className={`${errors.start_date ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} px-3 shadow-inner h-10 w-full text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2 `}
                        />
                <p className="absolute bottom-0 left-0 -mb-4 text-xs font-medium text-red-400">
                            {errors.start_date?.message}
            </p>
            </div>
            
            <div className="relative w-full mb-6">
                        <label>Введите конечное число</label>
                        <input  type="date" {...register("end_date")}
                            // autoComplete="false"
                            className={`${errors.end_date ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} px-3 shadow-inner h-10 w-full text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2 `}
                            placeholder="напр. Довран Джумакулыев"
                        />
                <p className="absolute bottom-0 left-0 -mb-4 text-xs font-medium text-red-400">
                            {errors.end_date?.message}
            </p>
            </div>
            </>
            }
            
            <div className="w-full flex justify-center items-center absolute -bottom-6">
            <button type="submit" disabled={loading} className="w-40 flex remove-button-bg justify-center items-center px-4 h-15 text-white transform ease-in-out duration-300 hover:scale-110 active:scale-100 font-semibold text-base rounded-full bg-green-500 hover:bg-green-400 active:bg-green-500 focus:outline-none shadow-md">
                            {loading ?
                                <div className="w-12 h-10 "><Loader size="sm" /></div>
                            :
                            <div className="h-10 flex justify-center items-center">{form === "deactivation" ? `Деактивировать` : `Добавить разрешение`}</div> 
                            }
                        </button>
            </div>
            </form>

        }
        </ModalContainer>
    )
}

const schema = (form) =>  Yup.object().shape({
    start_date: form === "delete" || form==="deactivation" ?Yup.string().nullable(true) : Yup.date().required('Обязательное поле').default(function () {
        return new Date();
      }),
    end_date: form === "delete" || form==="deactivation" ? Yup.string().nullable(true) : Yup.date().required('Обязательное поле'),
    comment: form === 'deactivation' ? Yup.string().min(5, "Минимум 5 символов").max(150, "Максимум 150 символов").required("Обязательное поле") : Yup.string().nullable(true)
    
});
 
 
export default Form;