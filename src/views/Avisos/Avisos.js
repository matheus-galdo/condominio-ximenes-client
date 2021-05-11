import { useContext, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import BackBtn from '../../components/BackBtn/BackBtn';
import OptionsBtn from '../../components/OptionsBtn/OptionsBtn';
import SearchBar from '../../components/SearchBar/SearchBar';
import { UserContext } from '../../Context/UserProvider';
import api from '../../Service/api';
import './Avisos.scss';

export default function Avisos(props) {

    const [avisosOriginal, setAvisosOriginal] = useState([])
    const [avisos, setAvisos] = useState([])
    const history = useHistory();
    const { user } = useContext(UserContext)


    useEffect(() => {
        api().get('avisos').then(response => {
            setAvisos(response.data)
            setAvisosOriginal(response.data)
        })
    }, [])


    function filter(e) {
        let value = e.target.value.toLowerCase()

        if(value === ''){
            setAvisos(avisosOriginal);
            return
        }

        let filtered = avisos.filter(aviso => 
            (aviso.titulo.toLowerCase().indexOf(value) >= 0)
        )

        setAvisos(filtered);
    }



    return <div className='module-wrapper'>

        <BackBtn />

        <h1>Avisos</h1>

        <div className='top-module-bar'>
            <SearchBar filter={filter} />

            <Link to='/avisos/cadastro/' className='btn-primary'>
                + Adicionar
            </Link>
        </div>


        {avisos.map((aviso, id) => {

            const options = [
                { name: 'Editar', f: () => history.push('/avisos/cadastro/' + aviso.id) },
                { name: 'Excluir', f: () => api().delete('avisos/' + aviso.id).then(response => console.log(aviso)) }
            ]

            return <div key={id} className='list-item-card'>
                <div className='list-item-card-content'>
                    <Link to={'/avisos/' + aviso.id}>
                        <h1>{aviso.titulo}</h1>
                    </Link>
                </div>

                {user.type === 1 && <OptionsBtn options={options} />}
            </div>
        })}


    </div>
}