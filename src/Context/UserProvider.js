import React, { useContext, useState } from 'react';
import storage from '../libs/storage';

let storedUser = storage.getItem('user') || null

export const UserContext = React.createContext({
    user: storedUser,
    setUser: () => { }
});


export default function UserProvider(props) {

    const [user, setUser] = useState(useContext(UserContext).user)
    const context = { user, setUser }
    
    return (
        <UserContext.Provider value={context}>
            {props.children}
        </UserContext.Provider>
    )
}