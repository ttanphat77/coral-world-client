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
import Album from "./pages/userGallery/album";
import UserContribution from "./pages/contributeMangement/userContribution";
import SimpleSidebar from "./components/sidebar";
import Welcome from "./pages/admin/welcome";
import SpeciesManagement from "./pages/admin/speciesManagement";
import GenusManagement from "./pages/admin/genusManagement";
import DivingSessionManagement from "./pages/admin/divingSessionManagement";
import Todofactsheet from "./pages/contributeMangement/todofactsheet";
import ImageLabeling from "./pages/contributeMangement/imageLabeling";
import SpeciesDraftManagement from "./pages/admin/speciesDraftManagement";
import SpeciesMediaManagement from "./pages/admin/speciesMediaManagement";
import LabelImageManagement from "./pages/admin/labeledImageManagement";
import ArticleEditor from "./pages/article/articleEditor";
import UserArticles from "./pages/contributeMangement/userArticles";
import ArticleView from "./pages/article/articleView";
import Articles from "./pages/articles";
import ArticleManagement from "./pages/admin/articleManagement";
import Gallery from "./pages/gallery";
import Profile from "./pages/profile";
import AccountManagement from "./pages/admin/accountManagement";

export const App = () => {
    const auth = useAuth();
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="editor" element={<ArticleEditor />} />
                        <Route path="articles">
                            <Route index element={<Articles />} />
                            <Route path=":id" element={<ArticleView />} />
                        </Route>
                        <Route path="taxonomy">
                            <Route index element={<Taxonomy />} />
                            <Route path=":id" element={<TaxonomyDetail />} />
                        </Route>
                        <Route path="gallery" element={<Gallery />} />
                        <Route path="auth" element={<RequireUnauth/>}>
                            <Route path="signin" element={<Signin />} />
                            <Route path="signup" element={<Signup />} />
                        </Route>
                        <Route path="user" element={<RequireUserAuth />}>
                            <Route path="gallery">
                                <Route index element={<UserGallery />} />
                                <Route path=":id" element={<Album />} />
                            </Route>
                            <Route path="profile" element={<Profile />} />
                            <Route path="contribute" element={<UserContribution />} />
                        </Route>
                        <Route path="researcher" element={<RequireResearcherAuth />}>
                            <Route path="contribute" element={<UserContribution />} />
                            <Route path="todo" element={<Todofactsheet />} />
                            <Route path="image-label" element={<ImageLabeling />} />
                            <Route path="articles">
                                <Route index element={<UserArticles />} />
                                <Route path=":id" element={<ArticleEditor />} />
                            </Route>
                        </Route>
                        <Route path="admin" element={<RequireAdminAuth />}>
                            <Route index element={<Welcome />} />
                            <Route path="species" element={<SpeciesManagement />} />
                            <Route path="genus" element={<GenusManagement />} />
                            <Route path="divingSession" element={<DivingSessionManagement />} />
                            <Route path="draft" element={<SpeciesDraftManagement />} />
                            <Route path="species-media" element={<SpeciesMediaManagement />} />
                            <Route path="label-image" element={<LabelImageManagement />} />
                            <Route path="articles" element={<ArticleManagement />} />
                            <Route path="account" element={<AccountManagement />} />
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
            <div style={{margin: '59px 0 0 0'}}>
                <Outlet/>
            </div>
        </div>
    )
}

function RequireUserAuth(props: any) {
    const auth = useAuth();
    if (!auth.isAuthenticated()) {
        return <Navigate to={'/auth/signin'}/>
    }
    return <Outlet />
}

function RequireResearcherAuth(props: any) {
    const auth = useAuth();
    if (!auth.isAuthenticated()) {
        return <Navigate to={'/auth/signin'}/>
    }
    return <Outlet />
}

function RequireAdminAuth(props: any) {
    const auth = useAuth();
    if (!auth.isAuthenticated()) {
        return <Navigate to={'/auth/signin'}/>
    }
    return (
        <SimpleSidebar>
            <div>
                <Outlet/>
            </div>
        </SimpleSidebar>)
}

function RequireUnauth() {
    const auth = useAuth();
    if (auth.user) {
        return <Navigate to={'/'}/>
    }
    return <Outlet />
}
