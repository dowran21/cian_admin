import { lazy } from "react"
// import { TiBusinessCard } from "@react-icons/all-files/ti/TiBusinessCard";
import { MdMergeType } from "@react-icons/all-files/md/MdMergeType";
import { TiLocationOutline } from "@react-icons/all-files/ti/TiLocationOutline";
import { HiOutlinePhotograph } from "@react-icons/all-files/hi/HiOutlinePhotograph"; 
import { MdBusiness } from "@react-icons/all-files/md/MdBusiness";
// import { RiVipCrown2Line } from "@react-icons/all-files/ri/RiVipCrown2Line";
// import { BiUserPin } from "@react-icons/all-files/bi/BiUserPin";
import { BiSupport } from "@react-icons/all-files/bi/BiSupport";
import { FaRegChartBar } from "@react-icons/all-files/fa/FaRegChartBar";
import { GoSettings } from "@react-icons/all-files/go/GoSettings";
import {FaUsers} from "@react-icons/all-files/fa/FaUsers"
import {AiOutlineFileText} from "@react-icons/all-files/ai/AiOutlineFileText"
import {MdLocationOff} from "@react-icons/all-files/md/MdLocationOff"
import {MdNotificationsActive} from "@react-icons/all-files/md/MdNotificationsActive"
import {GrCompliance} from "@react-icons/all-files/gr/GrCompliance"
import {HiTranslate} from "@react-icons/all-files/hi/HiTranslate"
import {SiPostgresql} from "@react-icons/all-files/si/SiPostgresql"
import {AiOutlineUsergroupDelete} from "@react-icons/all-files/ai/AiOutlineUsergroupDelete"
 
const Analytics = lazy(() => import('./Analytics'));
const Ctypes = lazy(() => import('./Ctypes'));
const Locations = lazy(() => import('./Locations'));
const Operators = lazy(() => import('./Operators'));
const Photos = lazy(() => import('./Photos'));
// const Profile = lazy(() => import('./Profile'));
const RealEstates = lazy(() => import('./RealEstates'));
const Specifications = lazy(() => import('./Specifications'));
const Users = lazy(() => import('./Users'));
// const Vip = lazy(() => import('./Vip'));
const DeactivatedLocations = lazy(() => import('./DeactivatedLocations'))
const Logs = lazy(() => import('./Logs'))
const UserActivation = (lazy(() => import('./UserActivation')))
const Translations = (lazy(() => import('./Translations')))
const Complaints = (lazy(() => import('./Complaints')))
const Pushes = (lazy(() => import('./Pushes')))
const Injections = (lazy(()=>import ('./Injections')))
const DeletedUsers = lazy (()=> import('./DeletedUser'))

export const routes = [
    {id:0, roles:{1:true, 2:false}, index:true, link:'', path:'/', title: 'Аналитика', element:<Analytics/>, icon:FaRegChartBar}, 

    {id:1, roles:{1:true, 2:false}, index:false, link:'operators', path:'operators', title: 'Операторы', element:<Operators/>, icon:BiSupport},

    {id:2, roles:{1:true, 2:false}, index:false, link:'ctypes', path:'ctypes', title: 'Типы', element:<Ctypes/>, icon:MdMergeType},

    {id:3, roles:{1:true, 2:true}, index:false, link:'users', path:'users', title: 'Пользователи', element:<Users/>, icon:FaUsers},


    {id:4, roles:{1:true, 2:false}, index:false, link:'specifications', path:'specifications', title: 'Спецификации', element:<Specifications/>, icon:GoSettings},

    {id:5, roles:{1:true, 2:false}, index:false, link:'locations', path:'locations', title: 'Локации', element:<Locations/>, icon:TiLocationOutline},


    {id:6, roles:{1:true, 2:true}, index:false, link:'real-estates', path:'real-estates', title: 'Объявления', element:<RealEstates/>, icon:MdBusiness},

    {id:7, roles:{1:true, 2:false}, index:false, link:'deactivated-locations', path:'deactivated-locations', title: 'Неактивные локации', element:<DeactivatedLocations/>, icon:MdLocationOff},
    
    {id:8, roles:{1:true, 2:false}, index:false, link:'logs', path:'logs', title: 'Логи', element:<Logs/>, icon:AiOutlineFileText},
    {id:9, roles:{1:true, 2:true}, index:false, link:'user_activation', path:'user_activation', title:"Активация", element:<UserActivation/>, icon:MdNotificationsActive},
    
    {id:10, roles:{1:true, 2:false}, index:false, link:'photos', path:'photos', title: 'Картинки', element:<Photos/>, icon:HiOutlinePhotograph},
    // {id:11, roles:{1:true, 2:false}, index:false, link:'translations', path:'translations', title: 'Переводы', element:<Translations/>, icon:HiTranslate},
    {id:12, roles:{1:true, 2:true}, index:false, link:'complaints', path:'complaints', title: 'Жалобы', element:<Complaints/>, icon:GrCompliance},
    {id:13, roles:{1:true, 2:true}, index:false, link:'injections', path:'injections', title: 'Инъекции', element:<Injections/>, icon:SiPostgresql},
    {id:13, roles:{1:true, 2:true}, index:false, link:'delusers', path:'delusers', title: 'Самоудаленные', element:<DeletedUsers/>, icon:AiOutlineUsergroupDelete},
    // {id:12, roles:{1:true, 2:true}, index:false, link:'push', path:'push', title: 'Уведомления', element:<Pushes/>, icon:GrCompliance},
    // {id:8, roles:{1:true, 2:false}, index:false, link:'vip', path:'vip', title: 'VIP', element:<Vip/>, icon:RiVipCrown2Line},

    // {id:9, roles:{1:true, 2:true}, index:false, link:'profile', path:'profile', title: 'Профиль', element:<Profile/>, icon:BiUserPin},
];
