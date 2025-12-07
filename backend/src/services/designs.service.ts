import { supabaseAdmin } from '../config/supabase'
import { uploadImageToCloudinary } from '../utils/uploadImage'
import { Design, DesignImage, CreateDesignWithImagesRequest } from '../types/design.types'
import { questionsService, CreateQuestionRequest } from '../services/questions.service'
import { logger } from '../utils/logger'

export class DesignsService {
  /**
   * 디자인 생성 및 이미지 업로드
   */
  async createDesignWithImages(
    projectId: string,
    designData: CreateDesignWithImagesRequest
  ): Promise<{ design: Design; images: DesignImage[] }> {
    // 1. 디자인 생성
    const { data: design, error: designError } = await supabaseAdmin
      .from('designs')
      .insert({
        project_id: projectId,
        name: designData.name,
      })
      .select()
      .single()

    if (designError) {
      throw new Error(`Failed to create design: ${designError.message}`)
    }

    // 2. 이미지 업로드 및 저장
    const uploadedImages: DesignImage[] = []

    if (designData.imageFiles && designData.imageFiles.length > 0) {
      for (let index = 0; index < designData.imageFiles.length; index++) {
        const file = designData.imageFiles[index]
        
        try {
          // Cloudinary에 업로드
          const folder = `projects/${projectId}/designs/${design.id}`
          const uploadResult = await uploadImageToCloudinary(file.buffer, folder)

          // 데이터베이스에 이미지 정보 저장
          const { data: image, error: imageError } = await supabaseAdmin
            .from('design_images')
            .insert({
              design_id: design.id,
              cloudinary_url: uploadResult.secure_url,
              cloudinary_public_id: uploadResult.public_id,
              screen_number: index + 1,
              display_order: index,
            })
            .select()
            .single()

          if (imageError) {
            logger.error(`Failed to save image ${index + 1} for design ${design.id}:`, imageError)
            // 이미지 저장 실패해도 계속 진행
          } else if (image) {
            uploadedImages.push(image)
          }
        } catch (error: any) {
          logger.error(`Failed to upload image ${index + 1} for design ${design.id}:`, error)
          // 이미지 업로드 실패해도 계속 진행
        }
      }
    }

    // 3. 질문 저장
    const questionsToCreate: CreateQuestionRequest[] = []
    let questionOrder = 0

    // 커스텀 질문 저장 (먼저 추가)
    if (designData.customQuestions && designData.customQuestions.length > 0) {
      designData.customQuestions.forEach((questionText) => {
        if (questionText && questionText.trim() !== '') {
          questionsToCreate.push({
            question_text: questionText.trim(),
            question_type: 'custom',
            question_category: designData.questionCategory || null,
          })
        }
      })
    }

    // 선택된 템플릿 질문 저장 (나중에 추가)
    if (designData.selectedQuestions && designData.selectedQuestions.length > 0) {
      designData.selectedQuestions.forEach((questionText) => {
        if (questionText && questionText.trim() !== '') {
          questionsToCreate.push({
            question_text: questionText.trim(),
            question_type: 'template',
            question_category: designData.questionCategory || null,
          })
        }
      })
    }

    // 질문 저장 (display_order는 createQuestions에서 자동으로 설정됨)
    if (questionsToCreate.length > 0) {
      try {
        await questionsService.createQuestions(projectId, questionsToCreate, design.id)
      } catch (error: any) {
        logger.error(`Failed to save questions for design ${design.id}:`, error)
        // 질문 저장 실패해도 계속 진행 (디자인과 이미지는 이미 저장됨)
      }
    }

    return {
      design,
      images: uploadedImages,
    }
  }

  /**
   * 프로젝트의 첫 번째 이미지 URL 가져오기 (썸네일용)
   */
  async getProjectThumbnail(projectId: string): Promise<string | null> {
    try {
      // 프로젝트의 첫 번째 디자인의 첫 번째 이미지 가져오기
      const { data: designs, error: designsError } = await supabaseAdmin
        .from('designs')
        .select('id')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true })
        .limit(1)

      if (designsError || !designs || designs.length === 0) {
        return null
      }

      const designId = designs[0].id

      const { data: images, error: imagesError } = await supabaseAdmin
        .from('design_images')
        .select('cloudinary_url')
        .eq('design_id', designId)
        .order('display_order', { ascending: true })
        .limit(1)

      if (imagesError || !images || images.length === 0) {
        return null
      }

      return images[0].cloudinary_url
    } catch (error: any) {
      logger.error(`Failed to get thumbnail for project ${projectId}:`, error)
      return null
    }
  }

  /**
   * 프로젝트의 모든 이미지 URL 가져오기
   */
  async getProjectImages(projectId: string): Promise<string[]> {
    try {
      // 프로젝트의 모든 디자인 가져오기
      const { data: designs, error: designsError } = await supabaseAdmin
        .from('designs')
        .select('id')
        .eq('project_id', projectId)

      if (designsError || !designs || designs.length === 0) {
        return []
      }

      const designIds = designs.map((d) => d.id)

      // 모든 디자인의 이미지 가져오기
      const { data: images, error: imagesError } = await supabaseAdmin
        .from('design_images')
        .select('cloudinary_url')
        .in('design_id', designIds)
        .order('display_order', { ascending: true })

      if (imagesError || !images) {
        return []
      }

      return images.map((img) => img.cloudinary_url)
    } catch (error: any) {
      logger.error(`Failed to get images for project ${projectId}:`, error)
      return []
    }
  }
}

export const designsService = new DesignsService()

