import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path='/register' element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App