import {Routes,Route} from 'react-router-dom'
import './App.css'

import Home from './pages/Home.tsx'
import BookAppointment from './pages/BookAppointment.tsx'
import Layout from "./components/Layout.tsx";
import Account from "./pages/Account.tsx";
import BarberDashboard from "./pages/BarberDashboard.tsx";

function App() {
  return (
    <>
        <Routes>
            <Route path="/" element={<Layout/>}>

            <Route index element={<Home />}></Route>
            <Route path="book" element={<BookAppointment />} />
            <Route path="account" element={<Account />} />
            <Route path="barber" element={<BarberDashboard />} />

            </Route>
            </Routes>



    </>
  )
}

export default App
