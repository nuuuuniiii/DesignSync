import cloudinary from '../config/cloudinary'
import { UploadApiResponse } from 'cloudinary'

/**
 * 이미지를 Cloudinary에 업로드하는 함수
 * @param fileBuffer - 업로드할 이미지 파일의 Buffer
 * @param folder - Cloudinary 폴더 경로 (선택적)
 * @returns Cloudinary 업로드 결과
 */
export async function uploadImageToCloudinary(
  fileBuffer: Buffer,
  folder?: string
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadOptions: {
      resource_type: 'image'
      folder?: string
      overwrite?: boolean
      invalidate?: boolean
    } = {
      resource_type: 'image',
      overwrite: true,
      invalidate: true,
    }

    if (folder) {
      uploadOptions.folder = folder
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error)
        } else if (result) {
          resolve(result)
        } else {
          reject(new Error('Upload failed: No result returned'))
        }
      }
    )

    uploadStream.end(fileBuffer)
  })
}

/**
 * Cloudinary에서 이미지 삭제
 * @param publicId - 삭제할 이미지의 Public ID
 */
export async function deleteImageFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error)
    throw error
  }
}

