import multer from 'multer'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  // if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' 
  //     || file.mimetype === 'image/jpeg'){
  //         cb(null, true);
  //     }else {
  //         cb(null, false);
  //     }
  if (!file.originalname.match(/\.(jpeg|jpg|png|webp|pdf|doc|docx|xlsx|xls)$/)) {
    return cb(
      new Error(
        'only upload files with jpg, jpeg, png, webp, pdf, doc, docx, xslx, xls format.'
      )
    );
  }
  cb(null, true);
}

export const upload = multer({storage: storage, fileFilter: fileFilter, limits: 10000000})
