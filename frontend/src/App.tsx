import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import {
  ExplorePage,
  MyPage,
  ProjectRegisterPage,
  NewFeedbackRatingPage,
  NewFeedbackScreenPage,
  RegistrationPage,
  MyProjectDetailPage,
  ProjectOverviewPage,
  SignUpPage,
  SignInPage,
} from './pages'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Navigate to="/explore" replace />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/my-page" element={<MyPage />} />
        <Route path="/my-projects/:projectId" element={<MyProjectDetailPage />} />
        <Route path="/my-projects/:projectId/web" element={<MyProjectDetailPage />} />
        <Route path="/projects/:projectId" element={<ProjectOverviewPage />} />
        <Route path="/projects/:projectId/web" element={<ProjectOverviewPage />} />
        <Route path="/projects/new" element={<ProjectRegisterPage />} />
        <Route path="/projects/:projectId/edit" element={<ProjectRegisterPage />} />
        <Route
          path="/projects/:projectId/feedback/rating"
          element={<NewFeedbackRatingPage />}
        />
        <Route
          path="/projects/:projectId/web/feedback/rating"
          element={<NewFeedbackRatingPage />}
        />
        <Route
          path="/projects/:projectId/feedback/screen"
          element={<NewFeedbackScreenPage />}
        />
        <Route
          path="/projects/:projectId/web/feedback/screen"
          element={<NewFeedbackScreenPage />}
        />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
