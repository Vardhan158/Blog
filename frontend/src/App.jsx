import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './components/Login'
import BlogArticle from './components/BlogArticle'
import Signup from './components/Signup'
import EditProfile from './components/EditProfile'
import Edit from './components/EditProfile'
import About from './components/About'
import Dashboard from './components/Dashboard'
import Publish from './components/Publish'
import Article from './pages/Article'
import AdminDashboard from './components/AdminDashboard'

function App() {


  return (
    <>
    <BrowserRouter>
       <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path='/publish' element={<Publish/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/article/:id' element={<BlogArticle/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/articles' element={<Article/>}/>
        <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
       </Routes>
       </BrowserRouter>

    </>

    
  )
}

export default App
