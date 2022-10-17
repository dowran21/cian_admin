import { useEffect, useRef, useState } from 'react';
import { axiosInstance } from '../application/api/index'
import toast from 'react-hot-toast';
import ConvertToFile from '../utils/convertToFile';
import {MdDeleteForever} from "@react-icons/all-files/md/MdDeleteForever";
import {MdDone} from "@react-icons/all-files/md/MdDone";
import {RiInboxUnarchiveLine} from "@react-icons/all-files/ri/RiInboxUnarchiveLine";

// import mime from 'mime-types';




function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return 'n/a'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
    if (i === 0) return `${bytes} ${sizes[i]})`
    return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
}


function ImageUpload({ myDocument, token, url, visible, setUploadedImage }) {
    const ref = useRef();
    const [selectedFiles, setFiles] = useState([]);
    const [progress, setProgress] = useState(0);
    const [fileLength, setFileLength] = useState(0);
    const [fileNames, setFileNames] = useState([]);
    const [success, setSuccess] = useState(false);
    const upload = async () => {
        const formData = new FormData()

        for (let i = 0; i < selectedFiles.length; i++) {
            const file = await ConvertToFile(selectedFiles[i].file, selectedFiles[i].type);
            formData.append('picture', file)
        }

        const config = {
            onUploadProgress: function (progressEvent) {
                setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
            },
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            },
        }
        axiosInstance.post(url, formData, config).then(res => {
            if (res) {
                if(res.data.rows){
                    setUploadedImage({id:myDocument.id, destination:res.data.rows['destination'], image_id:res.data.rows['id']})
                }
                setSuccess(true);
                setFiles([]);
                setFileLength(0);
            }
        }).catch(err => {
            setFiles([]);
            setFileLength(0);
            setSuccess(false);
            setProgress(0);
            setFileNames([]);
            console.log(err)
        });
    }

    const maxSelectFile = (event, files) => {
        if (files.length + selectedFiles.length > 1) {
            event.target.files = null;
            event.target.value = '';
            toast.error(`${1} suratdan artykmaç ýükläp bolanok!`);
            return false;
        }
        return true;
    }

    const checkFileSize = (event, files) => {
        let err = "";
        for (let i = 0; i < files.length; i++) {
            if (files[i].size > 10482944) {
                err += files[i].name + ` göwrimi iň köp ${bytesToSize(10482944)} bolmaly!\n`;
            }
        };
        if (err !== '') {
            event.target.files = null;
            event.target.value = '';
            toast.error(err);
            return false
        }
        return true;
    }


    const onChangeHandler = (event) => {
        event.preventDefault();
        const files = Object.values(event.target.files);
        if (maxSelectFile(event, files) && checkFileSize(event, files)) {
            // if return true allow to setState
            setFileLength(files.length)
            files.forEach(element => {
                const reader = new FileReader();
                reader.readAsDataURL(element);
                reader.onload = function (e) {
                    setFiles(prevArray => [...prevArray, { file: e.target.result, type: element.type }]);
                    setFileNames(prevState => [...prevState, element.name])
                }
            });
        }
    }

    useEffect(() => {
        if (selectedFiles.length !== 0 && fileLength !== 0 && visible === true) {
            if (selectedFiles.length === fileLength) {
                upload();
            }
        }
        let r = ref;
        return () => {
            if(visible === false){
                setFiles([]);
                setFileLength(0);
                setSuccess(false);
                setProgress(0);
                setFileNames([]);
                if (r.current) {
                    r.current.value = '';
                }
                
            }
        }
        // eslint-disable-next-line
    }, [selectedFiles, visible]);
    return (
        <div className="flex flex-col justify-between w-full">
  
            <div className="bg-white w-full shadow  border border-opacity-10 flex flex-col sm:flex-row justify-start items-center relative rounded-lg overflow-hidden py-2 sm:py-0">
                {myDocument.destination ? 
                    <img src={`${process.env.REACT_APP_FILE_URL}/${myDocument?.destination}`} className="object-contain rounded-lg w-48 sm:w-28 sm:h-28" alt="CTYPE" />
                    : null
                }
                <div className="flex flex-col justify-between py-1 items-center w-full h-20 sm:h-28">
                    <div className="relative flex flex-col h-full justify-between items-center w-full pt-2 sm:pt-5">
                        <label htmlFor={`doc-${myDocument.id}`} className=" cursor-pointer active:bg-gray-50 flex flex-row justify-center items-center border-2 px-2 py-1 rounded-lg text-blue-500 border-blue-500 border-dashed w-30">
                            <RiInboxUnarchiveLine className="text-xl mr-2" />
                            <p className="font-medium text-sm flex flex-col items-center justify-center">
                                Загрузить
                            </p>
                            <input ref={ref} id={`doc-${myDocument.id}`} type="file" onChange={onChangeHandler} multiple={myDocument.multiple} accept={myDocument.mimetype_web} required={myDocument.required} hidden />
                        </label>
                    </div>
                    <div className="w-full px-2 sm:mb-2">
                        <div className="relative flex flex-row justify-center items-center w-full pt-1">
                            <div className="px-2 w-full">
                                <div className="text-xs font-light text-blue-600 w-full">
                                    {fileNames.join(', ')}
                                </div>
                                <div className="overflow-hidden w-full h-2 text-xs flex rounded bg-gray-300">
                                    <div
                                        style={{ width: `${progress}%` }}
                                        className={`${(success === true && progress === 100) ? 'bg-green-400' : 'bg-blue-500 '} shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transform ease-in-out duration-200`}
                                    ></div>
                                </div>
                            </div>
                            <div className="relative flex flex-row justify-end items-center w-14 text-base -mt-2">
                                <MdDone className={`${(success === true && progress === 100) ? 'opacity-100' : 'opacity-0'} absolute top-0 -left-2 text-3xl text-green-500 mr-1 transform ease-in-out duration-500`} />
                                <div className={`${(success !== true && progress !== 100) ? 'opacity-100' : 'opacity-0'} absolute top-0 -left-1   transform ease-in-out duration-500 font-medium text-blue-500 whitespace-nowrap`}>
                                    {`${progress} %`}
                                </div>
                                <MdDeleteForever onClick={() => {
                                    setProgress(0);
                                    setSuccess({ id: myDocument.id, success: false })
                                    setFileNames([]);
                                    setFiles([]);
                                    if (ref.current) {
                                        ref.current.value = '';
                                    }
                                }} className="text-2xl text-gray-400 -mr-1 cursor-pointer z-30 hover:text-red-300 active:text-red-400" />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImageUpload;

