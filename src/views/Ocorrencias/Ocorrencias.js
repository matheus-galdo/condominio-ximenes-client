import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BackBtn from '../../components/BackBtn/BackBtn';
import OptionsBtn from '../../components/OptionsBtn/OptionsBtn';
import SearchBar from '../../components/SearchBar/SearchBar';
import { UserContext } from '../../Context/UserProvider';
import api from '../../Service/api';
import './Ocorrencias.scss';

export default function Ocorrencias(props) {

    const [ocorrenciasOriginal, setOcorrenciasOriginal] = useState([])
    const [ocorrencias, setOcorrencias] = useState([])
    // const history = useHistory();
    const { user } = useContext(UserContext)


    useEffect(() => {
        api().get('ocorrencias').then(response => {
            setOcorrencias(response.data)
            setOcorrenciasOriginal(response.data)
        })
        
    }, [])


    function filter(e) {
        let value = e.target.value.toLowerCase()

        if(value === ''){
            setOcorrencias(ocorrenciasOriginal);
            return
        }

        let filtered = ocorrencias.filter(ocorrencia => 
            (ocorrencia.assunto.toLowerCase().indexOf(value) >= 0) || 
            (ocorrencia.user.name.toLowerCase().indexOf(value) >= 0) || 
            (moment(ocorrencia.created_at).format('L').indexOf(value) >= 0)
        )

        setOcorrencias(filtered);
    }



    return <div className='module-wrapper'>

        <BackBtn />

        <h1>Ocorrências</h1>
        <div className='top-module-bar'>
            <SearchBar filter={filter} />

            <Link to='/ocorrencias/cadastro/' className='btn-primary'>
                + Adicionar
            </Link>
        </div>


        {ocorrencias.map((ocorrencia, id) => {

            const options = [
                // { name: 'Editar', f: () => history.push('/ocorrencias/cadastro/' + ocorrencia.id) },
                { name: 'Encerrar', f: () => api().delete('ocorrencias/' + ocorrencia.id).then(response => console.log(ocorrencia)) }
            ]

            return <div key={id} className='locatario-card'>
                <div className='locatario-card-content'>
                    <Link to={'/ocorrencias/' + ocorrencia.id}>
                        <h1>{ocorrencia.assunto}</h1>
                        {/* <p>{moment(locatario.data_chegada).format('L')}</p> */}
                        {user.type !== 4 && <p>Proprietário: {ocorrencia.user.name}</p>}
                    </Link>
                </div>

                {user.type === 1 && <OptionsBtn options={options} />}
            </div>
        })}

    </div>
}