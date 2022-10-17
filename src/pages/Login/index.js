import { useEffect, useReducer } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm } from "react-hook-form";
import { post } from '../../application/middlewares/index';
import { SetCookie } from '../../utils/cookie';
import { loginSuccess } from '../../application/actions/auth';
import toast from 'react-hot-toast';
import Loader  from '../../components/Loader';
import { RiLockPasswordLine } from "@react-icons/all-files/ri/RiLockPasswordLine";
import background from '../../assets/background.svg';
import logo from '../../assets/logo.svg'


function reducer(state, action) {
    switch (action.type) {
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            }
        default: return state;
    }
}
 
function UserLogin() {
    const [state, setState] = useReducer(reducer, {
        loading: false,
    });
    const { register, handleSubmit, formState: { errors } } = useForm({//setError
        resolver: yupResolver(schema),
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLogged } = useSelector(state => state.auth);
    const location = useLocation();
    useEffect(() => {
        if (isLogged === true) {
            if (location.state?.from) {
                navigate(location.state.from)
            } else {
                navigate('/')
            }
        }
        return () => {
            setState({ type: 'RESET_DATA' })
        }
    // eslint-disable-next-line
    }, [isLogged]);
    const onSubmit = (data) => {
        setState({ type: 'SET_LOADING', payload: true });
        dispatch(post({
            url: '/api/admin/login',
            data,
            action: (response) => {
                
                setState({ type: 'SET_LOADING', payload: false });
                if (response.success) {
                    SetCookie('refresh_token', response.data.refresh_token);
                    dispatch(loginSuccess(response.data));
                } else {
                    console.log(response?.message?.message);
                    if (response.message) {
                        toast.error(response?.message?.message)
                    }
                }
            },
            token: ''
        }));
    }

    return (
    <div className="w-full h-full relative flex flex-row justify-center lg:justify-start items-center lg:px-40">
        <img src={background} className="absolute top-0 left-0 object-cover  w-full h-full" alt="Background"/>
        <form style={{height:450}} onSubmit={handleSubmit(onSubmit)} className="w-full  max-w-sm relative px-8 flex flex-col justify-start items-center rounded-xl shadow-2xl mx-2 sm:mx-6 lg:mx-12">
            <p className="text-3xl pt-16 pb-6 font-semibold text-center text-gray-800">
                Войти в аккаунт
            </p>
            <div className="w-full flex flex-col mt-12">
                <div className="relative w-full mb-6">
                    <label>Телефон</label>
                    <input type="tel" {...register("phone")}
                        autoComplete="false"
                        className={`${errors.phone ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} pl-14 shadow-inner h-10 w-full text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2 `}
                        placeholder="6xxxxxxx"
                    />
                    <div className="absolute opacity-80 top-6 z-10 px-2 py-2 text-base font-medium text-gray-600 rounded-l h-10">
                        +993
                    </div>
                    <p className="absolute bottom-0 left-0 -mb-4 text-xs font-medium text-red-400">
                        {errors.phone?.message}
                    </p>
                </div>
                
                <div className="relative w-full mb-4">
                    <label >Пароль</label>
                    <input {...register("password")} autoComplete="false"
                        type="password"
                        className={`${errors.password ? 'border-2 border-red-300 ring-red-100' : 'ring-indigo-600'} pl-14 shadow-inner h-10 w-full text-base bg-gray-50 rounded-md z-20 focus:bg-white focus:outline-none focus:ring-2`}
                        placeholder="********"
                    />
                    <RiLockPasswordLine className="absolute text-3xl top-7 left-4 w-6 opacity-70"/>
                    <p className="absolute bottom-0 left-0 -mb-4 text-xs font-medium text-red-400">
                        {errors.password?.message}
                    </p>
                </div>
                <div className="absolute bottom-12 lg:bottom-10 left-0 right-0 mx-auto">
                    <div className="w-full flex justify-center items-center">
                        <button type="submit" disabled={state.loading} className="w-40 flex remove-button-bg justify-center items-center px-4 h-10 text-white transform ease-in-out duration-300 hover:scale-110 active:scale-100 font-semibold text-base rounded-full bg-green-500 hover:bg-green-400 active:bg-green-500 focus:outline-none shadow-md">
                            {state.loading ?
                                <div className="w-12"><Loader size="sm" /></div>
                            :
                                'Войти'
                            }
                        </button>
                    </div>
                </div>
            </div>
        </form>
        <div className="w-80 h-80 z-20 mx-2 sm:mx-6 lg:mx-16 rounded-3xl border-4 border-orange">
            <img src={logo} className="object-contain" alt="Logo" />
        </div>
    </div>
    );
}
 
const schema = Yup.object().shape({
    phone: Yup.string().min(8, "Минимум 8 значений").max(8, "Максимум 8 значений")
    .required("Номер телефона обязателен")
    .matches(
        /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/,
        "Должен быть номер телефона"
    ),
    password: Yup.string().min(8, "Минимум 8 значений").max(50, "Максимум 50 значений").required('Пароль обязателен'),
});
 
export default UserLogin;