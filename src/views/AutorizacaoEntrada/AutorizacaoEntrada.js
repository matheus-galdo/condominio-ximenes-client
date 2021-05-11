import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import BackBtn from "../../components/BackBtn/BackBtn";
import OptionsBtn from "../../components/OptionsBtn/OptionsBtn";
import SearchBar from "../../components/SearchBar/SearchBar";
import { UserContext } from "../../Context/UserProvider";
import api from "../../Service/api";

import './AutorizacaoEntrada.scss';

export default function AutorizacaoEntrada(props) {


    const [locatarios, setLocatarios] = useState([])
    const [locatariosOriginal, setLocatariosOriginal] = useState([])
    const history = useHistory();

    const { user } = useContext(UserContext)

    useEffect(() => {
        api().get('locatarios').then(response => {
            setLocatarios(response.data)
            setLocatariosOriginal(response.data)
        })
    }, [])


    useEffect(() => {

    },[locatariosOriginal])

    
    
    function filter(e) {
        let value = e.target.value.toLowerCase()

        if(value === ''){
            setLocatarios(locatariosOriginal);
            return
        }

        let filtered = locatarios.filter(locatario => 
            (locatario.nome.toLowerCase().indexOf(value) >= 0) || 
            (locatario.user.name.toLowerCase().indexOf(value) >= 0) || 
            (moment(locatario.data_chegada).format('L').indexOf(value) >= 0)
        )

        setLocatarios(filtered);
    }

    function deleted(item) {

        let list = [...locatariosOriginal]
        let index = list.indexOf(item)
        list.splice(index, 1)

        setLocatarios(list)
        setLocatariosOriginal(list)
    }


    return (
        <div className='module-wrapper'>

            <BackBtn />

            <h1>Autorização Entrada</h1>
            <div className='top-module-bar'>
                <SearchBar filter={filter}/>

                <Link to='/autorizacao-de-entrada/cadastro/' className='btn-primary'>
                    + Adicionar
                </Link>
            </div>


            {locatarios.map((locatario, id) => {

                const options = [
                    { name: 'Editar', f: () => history.push('/autorizacao-de-entrada/cadastro/'+locatario.id) },
                    { name: 'Excluir', f: () => api().delete('locatario/'+locatario.id).then(response => deleted(locatario)) }
                ]

                return <div key={id} className='list-item-card'>
                    <div className='list-item-card-content'>
                        <Link to={'/autorizacao-de-entrada/' + locatario.id}>
                            <h1>{locatario.nome}</h1>
                            <p>{moment(locatario.data_chegada).format('L')}</p>
                            {user.type !== 4 && <p>Proprietário: {locatario.user.name}</p>}
                        </Link>
                    </div>

                    {user.type === 1 && <OptionsBtn options={options} />}
                </div>
            })}

        </div>
    )
}