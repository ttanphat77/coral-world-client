import * as React from "react"
import Header from "./components/header"
import Home from "./pages/home"
import Taxonomy from "./pages/taxonomy"
import About from "./pages/about";
import {Routes, BrowserRouter, Route, Outlet, Navigate} from "react-router-dom";
import Signin from "./pages/authenticate/signin";
import Signup from "./pages/authenticate/signup";
import UserGallery from "./pages/userGallery/userGallery";
import {AuthProvider} from "./hooks/useAuth";
import TaxonomyDetail from "./pages/taxonomyDetail/taxonomyDetail";
import './App.css';
import {useAuth} from "./hooks/useAuth";

export const App = () => {
    const auth = useAuth();
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/taxonomy">
                            <Route index element={<Taxonomy />} />
                            <Route path=":id" element={<TaxonomyDetail />} />
                        </Route>
                        <Route path="/about" element={<About />} />
                        <Route path="/auth" element={<RequireUnauth/>}>
                            <Route path="signin" element={<Signin />} />
                            <Route path="signup" element={<Signup />} />
                        </Route>
                        <Route path="/user" element={<RequireUserAuth />}>
                            <Route path="gallery" element={<UserGallery />} />
                        </Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

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

function RequireUserAuth(props: any) {
    const auth = useAuth();
    if (!auth.user) {
        return <Navigate to={'/auth/signin'}/>
    }
    return <Outlet />
}

function RequireUnauth() {
    const auth = useAuth();
    if (auth.user) {
        return <Navigate to={'/'}/>
    }
    return <Outlet />
}
