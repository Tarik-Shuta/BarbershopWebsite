import {Routes,Route} from 'react-router-dom'
import './App.css'

import Home from './pages/Home.tsx'
import BookAppointment from './pages/BookAppointment.tsx'
import Layout from "./components/Layout.tsx";

function App() {
  return (
    <>
        <Routes>
            <Route path="/" element={<Layout/>}>

            <Route index element={<Home />}></Route>
            <Route path="book" element={<BookAppointment />} />

            </Route>
            </Routes>



    </>
  )
}

export default App
