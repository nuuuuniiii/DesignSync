import { Router } from 'express'
import { projectsController } from '../controllers/projects.controller'
import { authenticateToken } from '../middleware/auth.middleware'

const router = Router()

// 프로젝트 생성은 인증 필요
router.post('/', authenticateToken, (req, res) => projectsController.createProject(req, res))

// 프로젝트 목록 조회는 인증 불필요 (필터링 가능)
router.get('/', (req, res) => projectsController.getProjects(req, res))

// 프로젝트 상세 조회는 인증 불필요
router.get('/:id', (req, res) => projectsController.getProjectById(req, res))

export default router

