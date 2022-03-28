import * as React from "react"
import Header from "./components/header"
import Home from "./pages/home"
import Taxonomy from "./pages/taxonomy"
import About from "./pages/about";
import {Routes, BrowserRouter, Route, Outlet} from "react-router-dom";
import Signin from "./pages/authenticate/signin";
import Signup from "./pages/authenticate/signup";

export const App = () => (
    <BrowserRouter
        // basename={process.env.PUBLIC_URL}
    >
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/taxonomy" element={<Taxonomy />} />
                <Route path="/about" element={<About />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />
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
