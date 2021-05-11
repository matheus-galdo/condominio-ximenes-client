import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { FaLock } from "react-icons/fa";

import './Account.scss'
import { useContext, useEffect } from "react";

import BackBtn from "../../components/BackBtn/BackBtn";
import { UserContext } from "../../Context/UserProvider";


export default function Account(props) {

    const { user } = useContext(UserContext)

    useEffect(() => {
        document.title = "Minha Conta"
    }, []);

    return (

        <div className='account-container'>
            <section className='main'>
                <div className='user-card'>
                    <BackBtn />
                    <div className='user-card-content'>
                        <FaUserCircle className='user-icon' />
                        <h1>{user.name}</h1>
                        <h2>Addres</h2>
                    </div>
                </div>
            </section>
            <section className='account-links'>

                <div className='details'>
                    <p className='contatos'>Contatos</p>
                    <p>11 9505-0550</p>
                    <p>{user.email}</p>
                </div>

                <div className="links">
                    <Link className='link-btn' to='#'><MdEdit/>Editar Perfil</Link>
                    <Link className='link-btn' to='#'><FaLock/>Alterar Senha</Link>
                </div>

            </section>
        </div>
    )
}

