-- DesignSync 데이터베이스 초기 스키마 (snake_case)
-- Supabase SQL Editor에서 실행하거나 마이그레이션 도구로 실행

-- 1. users 테이블
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. projects 테이블
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  platform VARCHAR(10) NOT NULL CHECK (platform IN ('web', 'app')),
  category VARCHAR(50) NOT NULL CHECK (category IN (
    'E-Commerce',
    'Business',
    'Lifestyle',
    'Media',
    'Finance',
    'Technology',
    'Social',
    'Government',
    'Entertainment',
    'Wellness',
    'Education',
    'Travel'
  )),
  status VARCHAR(20) NOT NULL DEFAULT 'unresolved' CHECK (status IN ('resolved', 'unresolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. project_feedback_types 테이블 (프로젝트별 피드백 유형 다대다 관계)
CREATE TABLE IF NOT EXISTS project_feedback_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  feedback_type VARCHAR(50) NOT NULL CHECK (feedback_type IN (
    'User Flow',
    'Interaction Design',
    'Visual Design',
    'UX Writing',
    'Information Architecture',
    'Usability'
  )),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, feedback_type)
);

-- 4. designs 테이블 (프로젝트별 디자인)
CREATE TABLE IF NOT EXISTS designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. design_images 테이블 (디자인별 이미지)
CREATE TABLE IF NOT EXISTS design_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id UUID REFERENCES designs(id) ON DELETE CASCADE,
  cloudinary_url TEXT NOT NULL,
  cloudinary_public_id VARCHAR(255) NOT NULL,
  screen_number INTEGER NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. feedback_questions 테이블 (프로젝트별 또는 디자인별 피드백 질문)
CREATE TABLE IF NOT EXISTS feedback_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  design_id UUID REFERENCES designs(id) ON DELETE SET NULL,
  question_text TEXT NOT NULL,
  question_type VARCHAR(20) DEFAULT 'custom' CHECK (question_type IN ('custom', 'template')),
  question_category VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. feedbacks 테이블 (피드백 메인 테이블)
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  design_id UUID REFERENCES designs(id) ON DELETE SET NULL,
  question_id UUID REFERENCES feedback_questions(id) ON DELETE SET NULL,
  screen_number INTEGER,
  feedback_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. feedback_ratings 테이블 (피드백별 피드백 유형별 별점)
CREATE TABLE IF NOT EXISTS feedback_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id UUID REFERENCES feedbacks(id) ON DELETE CASCADE,
  feedback_type VARCHAR(50) NOT NULL CHECK (feedback_type IN (
    'User Flow',
    'Interaction Design',
    'Visual Design',
    'UX Writing',
    'Information Architecture',
    'Usability'
  )),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(feedback_id, feedback_type)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_platform ON projects(platform);
CREATE INDEX IF NOT EXISTS idx_project_feedback_types_project_id ON project_feedback_types(project_id);
CREATE INDEX IF NOT EXISTS idx_designs_project_id ON designs(project_id);
CREATE INDEX IF NOT EXISTS idx_design_images_design_id ON design_images(design_id);
CREATE INDEX IF NOT EXISTS idx_design_images_screen_number ON design_images(screen_number);
CREATE INDEX IF NOT EXISTS idx_feedback_questions_project_id ON feedback_questions(project_id);
CREATE INDEX IF NOT EXISTS idx_feedback_questions_design_id ON feedback_questions(design_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_project_id ON feedbacks(project_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_design_id ON feedbacks(project_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_user_id ON feedbacks(user_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_question_id ON feedbacks(question_id);
CREATE INDEX IF NOT EXISTS idx_feedback_ratings_feedback_id ON feedback_ratings(feedback_id);

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 트리거 설정
CREATE TRIGGER update_projects_updated_at 
  BEFORE UPDATE ON projects
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_designs_updated_at 
  BEFORE UPDATE ON designs
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feedbacks_updated_at 
  BEFORE UPDATE ON feedbacks
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

