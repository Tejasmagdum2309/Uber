import React, { useContext } from 'react'
import { BrowserRouter as Router,Route, Routes } from 'react-router-dom'
import Start from './pages/Start.jsx'
import UserLogin from './pages/UserLogin.jsx'
import UserSignup from './pages/UserSignup.jsx'
import Captainlogin from './pages/CaptainLogin.jsx'
import CaptainSignup from './pages/CaptainSignup.jsx'


const App = () => {

  return (
    <div>
      <Router>
      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/signup' element={<UserSignup />} />
        <Route path='/captain-login' element={<Captainlogin />} />
        <Route path='/captain-signup' element={<CaptainSignup />} />
      </Routes></Router>
    </div>
  )
}

export default App