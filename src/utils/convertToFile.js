function getFileType(type) {
    const types = {
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
        "application/vnd.ms-excel": ".xlsx",
        ".csv": ".xlsx",
        "csv": ".xlsx",
        "application/pdf": ".pdf",
        ".pdf": ".pdf",
        "pdf": ".pdf",
        "image/png": ".png",
        "image/jpeg": ".jpeg",
        "image/jpg": ".jpg"
    }
    return types[type] ? types[type] : ""
}

function blobToFile(theBlob, fileName) {
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}

const ConvertToFile = async (image, format) => {
    if (typeof image !== 'string') return false;
    let blobBin = atob(image.split(',')[1]);
    let array = [];
    for (let i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i));
    }
    let file = new Blob([new Uint8Array(array)], { type: format });
    let blob = blobToFile(file, "IMAGE-" + Date.now());

    return new File([blob], blob.name + getFileType(file.type), { type: file.type });
}



export default ConvertToFile;