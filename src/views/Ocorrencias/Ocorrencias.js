import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import BackBtn from '../../components/BackBtn/BackBtn';
import OptionsBtn from '../../components/OptionsBtn/OptionsBtn';
import SearchBar from '../../components/SearchBar/SearchBar';
import usePermissao from '../../Hooks/usePermissao';
import api from '../../Service/api';
import './Ocorrencias.scss';

export default function Ocorrencias(props) {

    const [ocorrenciasOriginal, setOcorrenciasOriginal] = useState([])
    const [ocorrencias, setOcorrencias] = useState([])
    const [hasLoaded, setHasLoaded] = useState(false)

    const history = useHistory();
    const { permissao } = usePermissao('ocorrencias')


    useEffect(() => {
        let mounted = true
        if (!hasLoaded) {
            api().get('ocorrencias').then(response => {
                if (mounted) {
                    setOcorrencias(response.data)
                    setOcorrenciasOriginal(response.data)
                }
            })
        }

        return () => mounted = false
    }, [])


    function filter(e) {
        let value = e.target.value.toLowerCase()

        if (value === '') {
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

    function getItenOptions(item, moduloName, reload) {

        let options = []

        if (item.concluida) {
            if (item.deleted_at) options.push({ name: 'Ativar', f: () => api().put(`${moduloName}/${item.id}`, { ativar: true }).then(response => reload(false)) })
            if (!item.deleted_at) options.push({ name: 'Desativar', f: () => api().put(`${moduloName}/${item.id}`, { ativar: false }).then(response => reload(false)) })
            if (permissao.excluir && item.deleted_at) options.push({ name: 'Excluir', f: () => api().delete(`${moduloName}/${item.id}`).then(response => reload(false)) })
            options.push({ name: 'Reabrir', f: () => api().put(`${moduloName}/${item.id}`, { encerrar: false }).then(response => reload(false)) })
        }

        if (!item.concluida) {
            if (permissao.editar) options.push({ name: 'Adicionar follow-up', f: () => history.push(`/ocorrencias-followup/${item.id}`) })
            options.push({ name: 'Encerrar', f: () => api().put(`${moduloName}/${item.id}`, { encerrar: true }).then(response => reload(false)) })
        }

        return options
    }


    return <div className='module-wrapper'>

        <BackBtn />
        {permissao.modulo && !permissao.acessar && <Redirect to='/nao-permitido' />}

        <h1>Ocorrências</h1>
        <div className='top-module-bar'>
            <SearchBar filter={filter} />

            {permissao.criar && <Link to='/ocorrencias/cadastro/' className='btn-primary'>
                + Adicionar
            </Link>}
        </div>


        <div className='list-item-container'>

            {ocorrencias.map((ocorrencia, id) => {

                let options = getItenOptions(ocorrencia, 'ocorrencias', setHasLoaded)

                return <div key={id} className='list-item-card'>
                    <div className='list-item-card-content'>
                        <Link to={`/ocorrencias/${ocorrencia.id}`}>
                            <h1>{ocorrencia.assunto}</h1>
                            <p>Apartamento: {ocorrencia.apartamento.numero} {ocorrencia.apartamento.bloco}</p>
                            <p>Status: {ocorrencia.concluida? 'Encerrada': ocorrencia.followup[ocorrencia.followup.length - 1].evento.nome}</p>
                        </Link>
                    </div>

                    {permissao.gerenciar && <OptionsBtn options={options} />}
                </div>
            })}
        </div>

    </div>
}

