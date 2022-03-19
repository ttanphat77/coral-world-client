import * as React from "react"
import Header from "./components/header"
import Home from "./pages/home"
import {Routes, BrowserRouter, Route, Outlet} from "react-router-dom";
import { Container } from "@chakra-ui/react"

export const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Layout/>}>
                <Route index element={<Home/>}/>
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
