import ModalContainer from "../../components/ModalContainer";
import ImageUpload from '../../components/ImageUpload';
import { useDispatch } from "react-redux";
import { post } from "../../application/middlewares";
import toast from "react-hot-toast";


function Form ({visible, setUploadedImage, form,main_id, setDeletedImage,values, token, setCloseModal}){
    const dispatch = useDispatch()
    const DeleteImage = ()=>{
        dispatch(post({
            url: `api/admin/delete-place-image/${values.id}`,
            token,
            action: (response) =>{
                if(response.success){
                    setDeletedImage(values.id)
                }else{
                    toast.error("Неизвестная ошибка")
                    setCloseModal()
                }
            }
        }))
    } 
    
    return (
        <ModalContainer size = "md" visible={visible}
        setCloseModal = {()=>setCloseModal()}
        title = {form==="delete_image"? "Удаление фотографию":`Добавить фотографии`}
        >
          {form==="delete_image"?
            <div className = "flex flex-col">
                <img src = {`${process.env.REACT_APP_FILE_URL}/${values.destination}`}/>
                <div className = "flex flex-row">
                <button onClick = {()=>setCloseModal()}className="w-1/2 rounded-l text-center py-3 bg-green-400 text-white focus:outline-none">
                        Отменить
                    </button>
                    <button onClick = {()=>DeleteImage()} className="w-1/2 rounded-r text-center py-3 bg-red-400 text-white focus:outline-none">
                        Удалить
                    </button>  
                </div>
            </div>
          :
          
            <ImageUpload
            visible={true}
            myDocument = {{"id":1}}
            token={token}
            setUploadedImage = {setUploadedImage}
            url = {`api/admin/add-page-image/${main_id}`}
            />
        }
        </ModalContainer>
    )
}
export default Form;