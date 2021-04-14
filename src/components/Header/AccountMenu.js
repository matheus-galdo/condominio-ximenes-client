import { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {BiLogOutCircle} from 'react-icons/bi';
import { AuthContext } from "../../Context/AuthProvider";
import useOuterClick from "../../Hooks/useOuterClick";
import storage from "../../libs/storage";

export default function AccountMenu(props) {

    const [show, setShow] = useState(false);
    const { setAuth } = useContext(AuthContext)
    const history = useHistory();

    const innerRef = useOuterClick(ev => props.closeMenu());

    useEffect(()=>{
        setShow(props.show)


    }, [props])


    function logout() {
        setAuth({ isAuthenticated: false, token: null })
        storage.removeItem('token')
        storage.removeItem('user')
        history.push('/login')
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