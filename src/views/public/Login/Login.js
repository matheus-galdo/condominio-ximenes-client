import { useContext, useEffect, useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import * as IconsFa from "react-icons/fa";

import { AuthContext } from "../../../Context/AuthProvider";
import storage from "../../../libs/storage";
import api from "../../../Service/api";
import './login.scss';
import { UserContext } from "../../../Context/UserProvider";

export default function Teste(props) {

    const [user, setUserState] = useState(null)
    const [password, setpassword] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)

    const history = useHistory();
    const { auth, setAuth } = useContext(AuthContext)
    const { setUser } = useContext(UserContext)
    


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

        api(true).post('/login', data).then(response => {

            storage.setItem('token', response.data.token)
            storage.setItem('user', response.data.user)
            setAuth({ isAuthenticated: true, token: response.data.token })
            setUser(response.data.user)
            history.push('/dashboard')

        }).catch(error => {
            setErrorMsg(error.response.data.message)
        });
    }


    return (
        <>
            {/* <ToastContainer/> */}
            {auth.isAuthenticated ?
                <>
                    <Redirect to='/dashboard' />
                </> :

                <div className='login-container'>
                    <div className='login-wrapper'>

                        <div className='logo'>
                            <h1>Ximenes2</h1>
                        </div>


                        <form className='login-form'>

                            <div className='form-group'>
                                <div className='input-group'>
                                    <span className="input-icon"><IconsFa.FaUserAlt /></span>
                                    <input placeholder='Usuário' type="text" onChange={event => setUserState(event.target.value)} />
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
                                <p className="register">Não tem uma conta? <Link to='/criar-conta'>Cadastre-se</Link></p>
                            </div>

                        </form>
                    </div>
                </div>
            }
        </>
    )
}