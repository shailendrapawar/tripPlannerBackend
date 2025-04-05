import multer from "multer";
import { v4 as uuid } from "uuid"

const myStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // console.log(file)
        cb(null, "./uploads")
    },
    filename: (req, file, cb) => {
        // console.log(file)
        const uniqueName = uuid() + "-" + file.originalname;
        cb(null, uniqueName);
    }
})


const upload = multer({ storage: myStorage })

export default upload;