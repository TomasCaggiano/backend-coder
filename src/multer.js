import { fileURLToPath } from 'url'
import { dirname } from 'path'
import multer from 'multer'

const __filename = fileURLToPath(
    import.meta.url)

export const __dirname = dirname(__filename)


//multer

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, __dirname + '/src/public/uploads')
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

export const uploader = multer({ storage })