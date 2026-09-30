import {Routes,Route} from 'react-router-dom'
import './App.css'

import Home from './pages/Home.tsx'
import Layout from "./components/Layout.tsx";

function App() {
  return (
    <>
        <Routes>
            <Route path="/" element={<Layout/>}>

            <Route index element={<Home />}></Route>

            </Route>
            </Routes>



    </>
  )
}

export default App
