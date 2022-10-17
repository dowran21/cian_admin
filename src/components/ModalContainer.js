import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";

function ModalContainer({visible, setCloseModal, size, title, children}){
    return(
        <Modal size={size} active={visible} toggler={()=>console.log(" ")}>
            <ModalHeader toggler={setCloseModal}>
                <span className="text-base md:text-xl">{title}</span>
            </ModalHeader>
            <ModalBody>
                {children}
            </ModalBody>
        </Modal>
    )
};

export default ModalContainer;