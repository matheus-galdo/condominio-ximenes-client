import React, { useContext, useState } from 'react';
import storage from '../libs/storage';

let storedToken = storage.getItem('token') || null

export const AuthContext = React.createContext({
    auth: { isAuthenticated: (storedToken)? true:false, token: storedToken },
    setAuth: () => { }
});


export default function AuthProvider(props) {

    const [auth, setAuth] = useState(useContext(AuthContext).auth)
    const context = { auth, setAuth }

    return (
        <AuthContext.Provider value={context}>
            {props.children}
        </AuthContext.Provider>
    )
}