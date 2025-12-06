import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import {
  ExplorePage,
  MyPage,
  ProjectRegisterPage,
  ProjectOverviewPage,
  NewFeedbackRatingPage,
  NewFeedbackScreenPage,
  RegistrationPage,
  MyProjectDetailPage,
} from './pages'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/explore" replace />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/my-page" element={<MyPage />} />
        <Route path="/my-projects/:projectId" element={<MyProjectDetailPage />} />
        <Route path="/my-projects/:projectId/web" element={<MyProjectDetailPage />} />
        <Route path="/projects/new" element={<ProjectRegisterPage />} />
        <Route path="/projects/:projectId" element={<ProjectOverviewPage />} />
        <Route path="/projects/:projectId/web" element={<ProjectOverviewPage />} />
        <Route path="/projects/:projectId/edit" element={<ProjectRegisterPage />} />
        <Route
          path="/projects/:projectId/feedback/rating"
          element={<NewFeedbackRatingPage />}
        />
        <Route
          path="/projects/:projectId/feedback/screen"
          element={<NewFeedbackScreenPage />}
        />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
