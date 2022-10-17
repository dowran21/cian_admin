import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm, Controller } from "react-hook-form";
import { post } from '../../application/middlewares/index';
import Loader  from '../../components/Loader';
import { useDispatch } from 'react-redux';
import ModalContainer from '../../components/ModalContainer';
// import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Switch from "react-switch";

 
function Form({ form, token, values, visible, addLocation, updateLocation, updateMainLocation, addMainLocation, setCloseModal}) {
    const [loading, setLoading] = useState(false);
    const { register, control, handleSubmit, formState: { errors }, setError, reset, setValue } = useForm({//
        resolver: yupResolver(schema),
        defaultValues:{enabled:false}
    });
    useEffect(() =>{
        if(visible === true && (form === 'update' || form === 'update_main_form')){
            Object.keys(values).forEach(key =>{
                if(key !== 'id'){
                    setValue(key, values[key])

                }
            })
        }else{
            reset({enabled:false})
        }
        // eslint-disable-next-line
    }, [visible]);
    const dispatch = useDispatch()
    const onSubmit = (data) => {
        setLoading(true)
        dispatch(post({
            url: form === 'create' ? `/api/admin/add-location/${values.main_location_id}` : form === 'create_main_form' ? '/api/admin/add-main-location' : `/api/admin/update-location/${values.id}`, 
            data,
            action: (response) => {
                console.log(response)
                reset({enabled:false})
                setLoading(false);
                if (response.success) {
                    if(form === 'create'){
                        addLocation(response.data.rows);   
                    }else if(form === 'update'){
                        updateLocation(response.data.rows);
                    }else if(form === 'create_main_form'){
                        addMainLocation(response.data.rows)
                    }else if(form === 'update_main_form'){
                        updateMainLocation(response.data.rows)
                    }else{
                        setCloseModal()
                    }
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
                    reset({enabled:false})
                }
            },
            token
        }));
    }
    return (
        <ModalContainer size="md" 
            setCloseModal={() => {
                setCloseModal();
                reset({enabled:false})
            }} 
            visible={visible} 
            title={(form === 'create_main_form' || form === 'update_main_form') ? 'Основные локации' : 'Районы'}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="w-full pb-12">
                <div className="relative w-full mb-6">
                    <label>На туркменском</label>
                    <input type="text" {...register("name_tm")}
                        autoComplete="false"
                        className={`${errors.name_tm ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} px-3 shadow-inner h-10 w-full text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2 `}
                        placeholder="напр. 5 mkr"
                    />
                    <p className="absolute bottom-0 left-0 -mb-4 text-xs font-medium text-red-400">
                        {errors.name_tm?.message}
                    </p>
                </div>
                <div className="relative w-full mb-6">
                    <label>На русском</label>
                    <input type="text" {...register("name_ru")}
                        autoComplete="false"
                        className={`${errors.name_ru ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} px-3 shadow-inner h-10 w-full text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2 `}
                        placeholder="напр. 5 мкр"
                    />
                    <p className="absolute bottom-0 left-0 -mb-4 text-xs font-medium text-red-400">
                        {errors.name_ru?.message}
                    </p>
                </div>
                <div className="relative w-full flex flex-row justify-start items-center mb-2 lg:mr-2">
                    <label className="mr-2">Статус</label>
                    <Controller
                        control={control}
                        name="enabled"
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
                        {errors.enabled?.message}
                    </p>
                </div>

                <div className="w-full flex justify-center items-center absolute -bottom-6">
                    <button type="submit" disabled={loading} className="w-40 flex remove-button-bg justify-center items-center px-4 h-10 text-white transform ease-in-out duration-300 hover:scale-110 active:scale-100 font-semibold text-base rounded-full bg-green-500 hover:bg-green-400 active:bg-green-500 focus:outline-none shadow-md">
                        {loading ?
                            <div className="w-12"><Loader size="sm" /></div>
                        :
                           `${Object.values(values)?.length > 0 ? 'Изменить' : 'Добавить'}` 
                        }
                    </button>
                </div>
            </form>
        </ModalContainer>
    )
}

const schema =  Yup.object().shape({
    name_ru: Yup.string().required('Обязательное поле').min(3, 'Минимум 3 значений').max(50, 'Минимум 50 значений'),
    name_tm: Yup.string().required('Обязательное поле').min(3, 'Минимум 3 значений').max(50, 'Минимум 50 значений'),
    enabled: Yup.bool().required(),
});
 
 
export default Form;