import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Projecthomepage from './components/Projecthomepage.jsx'
import Dashboard from './components/Dashboard.jsx'


//index.css
createRoot(document.getElementById('root')).render(
    <BrowserRouter>
   <Routes>
    <Route path='/' element={<Projecthomepage/>}></Route>
    <Route path='/dashboard' element={<Dashboard/>}></Route>
   </Routes>
    </BrowserRouter>
)
