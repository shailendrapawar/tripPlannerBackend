import multer from "multer";
import path from "path";
import { v4 as uuid } from "uuid"

const myStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads")
    },
    filename: (req, file, cb) => {
        // console.log(file)
        // const uniqueName=
        const uniqueName = uuid() + "-" + file.originalname;
        cb(null, uniqueName);
    }
})


const upload = multer({ storage: myStorage })

export default upload;