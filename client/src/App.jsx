import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import StudentDashboard from './pages/StudentDashboard'

const App = () => {
  return (

    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path='/register' element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <StudentDashboard />
            }
          />

          <Route path="/" element={<Navigate to="/login" replace />} />

        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App