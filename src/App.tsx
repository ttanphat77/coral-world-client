import * as React from "react"
import Header from "./components/header"
import Home from "./pages/home"
import Taxonomy from "./pages/taxonomy"
import About from "./pages/about";
import {Routes, BrowserRouter, Route, Outlet} from "react-router-dom";
import {Box} from "@chakra-ui/react";

export const App = () => (
    <BrowserRouter
        // basename={process.env.PUBLIC_URL}
    >
        <Header/>
        <hr/>
            <Box style={{margin: '75px 0 0 0'}}>
                <Routes>
                    <Route path={'/'} element={<Home/>}/>
                    <Route path={'/taxonomy'} element={<Taxonomy/>}/>
                    <Route path={'/about'} element={<About/>}/>
                </Routes>
            </Box>
    </BrowserRouter>
)

function Layout() {
    return (
        <div>
        </div>
    )
}
