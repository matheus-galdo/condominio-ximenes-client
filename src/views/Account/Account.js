import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

import './Account.scss'
import { useEffect } from "react";

export default function Account(props) {

    useEffect(() => {
        document.title = "Minha Conta"
    }, []);

    return (

        <div className='account-container'>
            <section className='main'>
                <div>
                    <Link to='/dashboard'>{'<'} Voltar</Link>
                    <FaUserCircle/>
                    <h1>User</h1>
                    <h2>Addres</h2>
                </div>
            </section>
            <section>

                <div className='details'>

                </div>
                <div className="links">
                    <Link>Editar Perfil</Link>
                    <Link>Alterar Senha</Link>
                </div>
            </section>
        </div>
    )
}