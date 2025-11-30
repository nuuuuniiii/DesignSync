import { useRef, useState } from 'react'

interface ImageUploadProps {
  onImagesChange?: (files: File[]) => void
  maxFiles?: number
  accept?: string
}

export const ImageUpload = ({
  onImagesChange,
  maxFiles = 10,
  accept = 'image/*',
}: ImageUploadProps) => {
  const [previews, setPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > maxFiles) {
      alert(`최대 ${maxFiles}개까지 업로드할 수 있습니다.`)
      return
    }

    const filePreviews = files.map((file) => URL.createObjectURL(file))
    setPreviews(filePreviews)
    onImagesChange?.(files)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    )
    if (files.length > maxFiles) {
      alert(`최대 ${maxFiles}개까지 업로드할 수 있습니다.`)
      return
    }

    const filePreviews = files.map((file) => URL.createObjectURL(file))
    setPreviews(filePreviews)
    onImagesChange?.(files)
  }

  const removeImage = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index)
    setPreviews(newPreviews)
  }

  return (
    <div className="image-upload">
      <div
        className="upload-area"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
      >
        <p>이미지를 드래그 앤 드롭하거나 클릭하여 업로드</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
      {previews.length > 0 && (
        <div className="image-previews">
          {previews.map((preview, index) => (
            <div key={index} className="image-preview">
              <img src={preview} alt={`Preview ${index + 1}`} />
              <button onClick={() => removeImage(index)}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

