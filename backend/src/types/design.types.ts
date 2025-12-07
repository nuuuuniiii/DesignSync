export interface Design {
  id: string
  project_id: string
  name: string
  created_at: string
  updated_at: string
}

export interface DesignImage {
  id: string
  design_id: string
  cloudinary_url: string
  cloudinary_public_id: string
  screen_number: number
  display_order: number
  created_at: string
}

export interface CreateDesignRequest {
  name: string
  images?: Express.Multer.File[]
}

export interface CreateDesignWithImagesRequest {
  name: string
  imageFiles: Express.Multer.File[]
  customQuestions?: string[]
  selectedQuestions?: string[]
  questionCategory?: string
}

