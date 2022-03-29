import React, {useState, useContext, createContext} from "react";
import http from '../http-common'

const authContext = createContext();
const apiUrl = process.env.REACT_APP_API_URL + '/Login';

export function AuthProvider({ children }) {
    const auth = useProvideAuth()
    return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
    return useContext(authContext);
}

function useProvideAuth() {
    const [user, setUser] = useState(null);
    const signin = (email, password) => {
        http.post(apiUrl + '/Login', {email, password})
            .then(res => {
                setUser(res.data);
                localStorage.setItem('user', JSON.stringify(res.data));
            })
            .catch(err => {
                console.log(err);
            });
    }

    return {
        user: null,
        signin,
        signup: () => {},
        signout: () => {},
    }

}
