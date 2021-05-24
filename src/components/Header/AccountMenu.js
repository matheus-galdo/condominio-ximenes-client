import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {BiLogOutCircle} from 'react-icons/bi';
import { AuthContext } from "../../Context/AuthProvider";
import useOuterClick from "../../Hooks/useOuterClick";
import storage from "../../libs/storage";
import { UserContext } from "../../Context/UserProvider";

export default function AccountMenu(props) {

    const [show, setShow] = useState(false);
    const { setAuth } = useContext(AuthContext)
    const { setUser } = useContext(UserContext)

    const innerRef = useOuterClick(ev => props.closeMenu());

    useEffect(()=>{
        setShow(props.show)
    }, [props])


    function logout() {
        setAuth({ isAuthenticated: false, token: null })
        setUser({})
        storage.removeItem('token')
        storage.removeItem('user')
        window.location.href = '/login'
}


    return (
        <>
            {show && <div ref={innerRef} className='account-menu'>
                <Link to='/minha-conta'>Minha conta</Link>
                <button onClick={logout}><BiLogOutCircle/>Sair</button>
            </div>}
        </>
    )
}