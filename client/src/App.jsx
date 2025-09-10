import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import StudentDashboard from './pages/StudentDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {
  return (

    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path='/register' element={<Register />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App