import React from 'react'
import Home from './Home'
import Form from './Form'
import { NavLink, Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <div id="app">
      <nav>
        {/* NavLinks here */}
        <NavLink to='/' activeclassname="Active">Home</NavLink>
        <NavLink to='/order' activeclassname="Active">Order</NavLink>
      </nav>
      {/* Route and Routes here */}
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/order' element={<Form />}/>
      </Routes>
    </div>
  )
}
