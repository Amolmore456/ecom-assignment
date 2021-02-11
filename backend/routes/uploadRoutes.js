import express from 'express'
const router = express.Router()
import multer from 'multer'
// var multer = require('multer')
import path from 'path'

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.filename}-${Date.now()}.${path.extname(file.originalname)}`
    )
  },
})

function checkFileType(file, cb) {
  const fileTypes = /jpg|jpeg|png/
  const extname = fileTypes.test(
    path.extname(file.originalname).toLocaleLowerCase()
  )
  const mimetypes = fileTypes.test(file.mimetypes)
  if (extname && mimetypes) {
    return cb(null, true)
  } else {
    cb('Images only!')
  }
}

const upload = multer({
  // storage: storage,
  // fileFilter: function (req, file, cb) {
  //   checkFileType(file, cb)
  // },
  dest: 'uploads/',
})

router.post('/', upload.single('image'), (req, res) => {
  console.log(req.file)
  res.send(`/images/${req.file.filename}.jpg`)
})

export default router
