import * as React from "react"
import Header from "./components/header"
import Home from "./pages/home"
import Taxonomy from "./pages/taxonomy"
import {Routes, BrowserRouter, Route, Outlet} from "react-router-dom";

export const App = () => (
    <BrowserRouter
        // basename={process.env.PUBLIC_URL}
    >
        <Routes>
            <Route path='/' element={<Layout/>}>
                <Route index element={<Home/>}/>
                <Route path='taxonomy' element={<Taxonomy/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
)

function Layout() {
    return (
        <div>
            <Header/>
            <hr/>
            <div style={{margin: '75px 0 0 0'}}>
                <Outlet/>
            </div>
        </div>
    )
}
