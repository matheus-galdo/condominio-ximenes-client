import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import BackBtn from '../../components/BackBtn/BackBtn';
import OptionsBtn from '../../components/OptionsBtn/OptionsBtn';
import SearchBar from '../../components/SearchBar/SearchBar';
import usePermissao from '../../Hooks/usePermissao';
import api from '../../Service/api';
import './Avisos.scss';

export default function Avisos(props) {

    const [avisosOriginal, setAvisosOriginal] = useState([])
    const [avisos, setAvisos] = useState([])
    const [hasLoaded, setHasLoaded] = useState(false)
    const history = useHistory();
    const { permissao } = usePermissao('avisos')


    useEffect(() => {
        let mounted = true
        if (!hasLoaded) {
            api().get('avisos').then(response => {
                if (mounted) {
                    setAvisos(response.data)
                    setAvisosOriginal(response.data)
                }
            })
        }

        return () => mounted = false
    }, [])


    function filter(e) {
        let value = e.target.value.toLowerCase()

        if (value === '') {
            setAvisos(avisosOriginal);
            return
        }

        let filtered = avisos.filter(aviso =>
            (aviso.titulo.toLowerCase().indexOf(value) >= 0)
        )

        setAvisos(filtered);
    }

    
    function getItenOptions(item, moduloName, reload) {

        let options = []

        if (permissao.editar) options.push({ name: 'Editar', f: () => history.push(`/${moduloName}/cadastro/${item.id}`) })

        if (item.deleted_at) {
            options.push({ name: 'Ativar', f: () => api().put(`${moduloName}/${item.id}`, { ativar: true }).then(response => reload(false)) })
        } else {
            options.push({ name: 'Desativar', f: () => api().put(`${moduloName}/${item.id}`, { ativar: false }).then(response => reload(false)) })
        }

        if (permissao.excluir && item.deleted_at) {
            options.push({ name: 'Excluir', f: () => api().delete(`${moduloName}/${item.id}`).then(response => reload(false)) })
        }

        return options
    }



    return <div className='module-wrapper'>

        <BackBtn />
        {permissao.modulo && !permissao.acessar && <Redirect to='/nao-permitido' />}

        <h1>Avisos</h1>

        <div className='top-module-bar'>
            <SearchBar filter={filter} />

            {permissao.criar && <Link to='/avisos/cadastro/' className='btn-primary'>
                + Adicionar
            </Link>}
        </div>

        <div className='list-item-container'>

            {avisos.map((aviso, id) => {

                let options = getItenOptions(aviso, 'avisos', setHasLoaded)

                return <div key={id} className='list-item-card'>
                    <div className='list-item-card-content'>
                        <Link to={'/avisos/' + aviso.id}>
                            <h1>{aviso.titulo}</h1>
                            <p>Data: {moment(aviso.created_at).format('L')}</p>
                            {permissao.gerenciar && <p>Status: {aviso.deleted_at ? 'Desativado' : 'Ativado'}</p>}
                        </Link>
                    </div>

                    {permissao.gerenciar && <OptionsBtn options={options} />}
                </div>
            })}

        </div>

    </div>
}