const multer = require('multer')
const imageRegex = /\.(jpg|jpeg|png)$/

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(imageRegex))
      return cb(new Error('Please upload an image'))

    cb(undefined, true)
  },
  
})

module.exports = upload