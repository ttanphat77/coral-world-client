import React, {useState, useContext, createContext, useEffect} from "react";
import http from '../http-common'
import {useNavigate} from "react-router-dom";
import AccountServices from "../services/accountServices";

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
    const signin = (email, password, callback) => {
        http.post(apiUrl + '/Login', {email, password})
            .then(res => {
                setUser(res.data);
                localStorage.setItem('user', JSON.stringify(res.data));
                navigate('/', {replace: true});
                callback(false);
                return user
            })
            .catch(err => {
                callback(true);
            })
    }

    const refreshUser = (user) => {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
    }

    const signup = (account) => {
        http.post(apiUrl + '/Register', {email: account.email, password: account.password})
            .then(res => {
                AccountServices.create(account)
                    .then(res => {
                        http.post(apiUrl + '/Login', {email: account.email, password: account.password})
                            .then(res => {
                                setUser(res.data);
                                localStorage.setItem('user', JSON.stringify(res.data));
                                navigate('/', {replace: true});
                                return user
                            })
                            .catch(err => {
                            })
                    })
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
        refreshUser,
    }

}
