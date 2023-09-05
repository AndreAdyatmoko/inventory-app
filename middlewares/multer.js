const multer = require('multer')
const fs = require('fs')
const path = require('path')

let defaultPath = "public"

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        const isDirectoryExist = fs.existsSync(`${defaultPath}/${file.fieldname}`)
        if(!isDirectoryExist){
            fs.mkdirSync(`${defaultPath}/${file.fieldname}`, { recursive: true })
        }
        cb(null, `${defaultPath}/${file.fieldname}`)
    },
    filename: function (req, file, cb){
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

const maxSize = 5 * 1024 * 1024;

const fileFilter = (req, file, cb) => {
    const fileType = file.mimetype.split('/')[1];
    if (fileType == 'jpeg' || fileType === 'jpg' || fileType === 'png') {
        cb(null, true);
    } else {
        cb(new Error("Format file tidak didukung"), false);
    }
}

exports.multerUpload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: fileFilter
})
