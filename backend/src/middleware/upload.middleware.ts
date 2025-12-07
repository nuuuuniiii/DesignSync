import multer from 'multer'
import { Request } from 'express'

// 메모리 스토리지 사용 (파일을 메모리에 저장, Cloudinary 업로드 후 삭제)
const storage = multer.memoryStorage()

// 파일 필터: 이미지만 허용
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed'))
  }
}

// Multer 설정
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB 제한
    files: 20, // 최대 20개 파일
  },
})

// 여러 이미지 업로드용
export const uploadMultipleImages = upload.array('images', 20)

// 단일 이미지 업로드용
export const uploadSingleImage = upload.single('image')

