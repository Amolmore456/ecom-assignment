import express from 'express'
const router = express.Router()
import multer from 'multer'

// const express = require('express')
// const router = express.Router()
// var multer = require('multer')
let upload = multer({ dest: 'uploads/' })

// --- ENDPOINT START ---
router.post('/', upload.single('image'), (req, res) => {
  console.log(req.file)
  return res.status(200).json({
    message: 'test works',
  })
})

// --- ENDPOINT ENDS ---

export default router
