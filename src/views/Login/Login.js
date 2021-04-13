import api from "../../api";

import './login.scss';
import * as IconsFa from "react-icons/fa";
import { Link, Redirect, useHistory } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthProvider";
import storage from "../../libs/storage";


export default function Teste(props) {

    const [user, setUser] = useState(null)
    const [password, setpassword] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)

    const history = useHistory();
    const { auth, setAuth } = useContext(AuthContext)

    useEffect(() => {
        document.title = "Login"
    }, []);

    function login(event) {
        event.preventDefault()

        if (!user || !password) {
            setErrorMsg('Preencha os campos de usuário e senha')
            return;
        }

        let data = { email: user, password: password }

        api.post('/login', data).then(response => {

            setAuth({ isAuthenticated: true, token: response.data.token })
            storage.setItem('token', response.data.token)
            storage.setItem('user', response.data.user)
            history.push('/dashboard')

        }).catch(error => {
            setErrorMsg('Usuário ou senha incorretos')
        });
    }


    return (
        <>
            {auth.isAuthenticated ?
                <Redirect to='/dashboard' /> :

                <div className='login-container'>
                    <div className='login-wrapper'>

                        <div className='logo'>
                            <h1>Ximenes2</h1>
                        </div>


                        <form className='login-form'>

                            <div className='form-group'>
                                <div className='input-group'>
                                    <span className="input-icon"><IconsFa.FaUserAlt /></span>
                                    <input placeholder='Usuário' type="text" onChange={event => setUser(event.target.value)} />
                                </div>
                            </div>

                            <div className='form-group'>
                                <div className='input-group'>
                                    <span className="input-icon"><IconsFa.FaLock /></span>
                                    <input placeholder='Senha' type="password" onChange={event => setpassword(event.target.value)} />
                                </div>
                            </div>


                            <div className='form-group'>
                                <span className="form-validation"><p>{errorMsg}</p></span>
                            </div>

                            <div className='form-group'>
                                <button onClick={login}>Entrar</button>
                            </div>

                            <div className='form-group'>
                                <p className="register">Não tem uma conta? <Link to='/teste'>Cadastre-se</Link></p>
                            </div>

                        </form>
                    </div>
                </div>
            }
        </>
    )
}