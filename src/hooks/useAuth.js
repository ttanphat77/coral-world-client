import React, {useState, useContext, createContext, useEffect} from "react";
import http from '../http-common'
import {useNavigate} from "react-router-dom";

const authContext = createContext();
const apiUrl = process.env.REACT_APP_API_URL + '/Login';

export function AuthProvider({children}) {
    const auth = useProvideAuth()
    return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
    return useContext(authContext);
}

function useProvideAuth() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const signin = (email, password) => {
        http.post(apiUrl + '/Login', {email, password})
            .then(res => {
                setUser(res.data);
                localStorage.setItem('user', JSON.stringify(res.data));
                navigate('/', {replace: true})
                return user
            })
    }

    const signup = (email, password) => {
        http.post(apiUrl + '/Register', {email, password})
            .then(res => {
                setUser(res.data);
                localStorage.setItem('user', JSON.stringify(res.data));
                return res.data;
            })
            .catch(err => {
                return err;
            });
    }

    const signout = () => {
        setUser(null);
        localStorage.removeItem('user');
    }

    useEffect(() => {
        const localUser = localStorage.getItem('user');
        if (localUser) {
            setUser(JSON.parse(localUser));
        }
    }, []);

    const isAuthenticated = () => {
        return user || localStorage.getItem('user');
    }

    return {
        user,
        signin,
        signup,
        signout,
        isAuthenticated,
    }

}
