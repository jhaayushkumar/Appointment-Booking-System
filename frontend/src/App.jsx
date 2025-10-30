import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Doctors from './Pages/Doctors'
const App = () => {
  return (
    <div>
    <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/doctors" element={<Doctors/>}/>
    <Route path="/" element={<Home/>}/>
    <Route path="/" element={<Home/>}/>
    <Route path="/" element={<Home/>}/>
    <Route path="/" element={<Home/>}/>

    </Routes>   

    </div>
  )
}

export default App