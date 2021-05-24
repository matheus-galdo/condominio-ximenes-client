import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import BackBtn from '../../components/BackBtn/BackBtn';
import OptionsBtn from '../../components/OptionsBtn/OptionsBtn';
import SearchBar from '../../components/SearchBar/SearchBar';
import usePermissao from '../../Hooks/usePermissao';
import api from '../../Service/api';
import './Ocorrencias.scss';

export default function Ocorrencias(props) {

    const [finalEventos] = useState(['Concluída', 'Cancelada'])
    const [eventoConcluida, setEventoConcluida] = useState(null)
    const [eventoCancelada, setEventoCancelada] = useState(null)
    const [eventoReaberta, setEventoReaberta] = useState(null)
    const [hasRequestedEventos, setHasRequestedEventos] = useState(false)


    const [ocorrenciasOriginal, setOcorrenciasOriginal] = useState([])
    const [ocorrencias, setOcorrencias] = useState([])
    const [hasLoaded, setHasLoaded] = useState(false)

    const { permissao } = usePermissao('ocorrencias')


    useEffect(() => {
        let mounted = true
        if (!hasLoaded) {
            api().get('ocorrencias').then(response => {
                if (mounted) {
                    setHasLoaded(true)
                    setOcorrencias(response.data)
                    setOcorrenciasOriginal(response.data)
                }
            })
        }

        return () => mounted = false
    }, [hasLoaded])


    useEffect(() => {
        let mounted = true

        if (!hasRequestedEventos) {
            api().get('listar-eventos-ocorrencia').then(response => {
                if (mounted) {
                    setHasRequestedEventos(true)
                    setEventoConcluida(response.data.find(evento => evento.nome === 'Concluída'))
                    setEventoCancelada(response.data.find(evento => evento.nome === 'Cancelada'))
                    setEventoReaberta(response.data.find(evento => evento.nome === 'Reaberta'))
                }
            })
        }

        return () => mounted = false
    }, [hasRequestedEventos])


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

        console.log(item);

        let options = []
        let lastFollowup = item.followup[item.followup.length - 1].evento

        if (item.deleted_at) options.push({ name: 'Ativar', f: () => api().put(`${moduloName}/${item.id}`, { ativar: true }).then(response => reload(false)) })
        if (!item.deleted_at) options.push({ name: 'Desativar', f: () => api().put(`${moduloName}/${item.id}`, { ativar: false }).then(response => reload(false)) })
        if (permissao.excluir && item.deleted_at) options.push({ name: 'Excluir', f: () => api().delete(`${moduloName}/${item.id}`).then(response => reload(false)) })


        if (finalEventos.includes(lastFollowup.nome)) {
            let formData = { descricao: 'Ocorrência reaberta.', arquivos: [], evento: eventoReaberta.id, ocorrencia: item.id }
            options.push({ name: 'Reabrir', f: () => api().post(`ocorrencias-followup`, formData).then(response => reload(false)) })
        } else {
            let formDataConcluir = { descricao: 'Ocorrência encerrada.', arquivos: [], evento: eventoConcluida.id, ocorrencia: item.id }
            let formDataCancelar = { descricao: 'Ocorrência cancelada.', arquivos: [], evento: eventoCancelada.id, ocorrencia: item.id }

            options.push({ name: 'Encerrar', f: () => api().post(`ocorrencias-followup`, formDataConcluir).then(response => reload(false)) })
            options.push({ name: 'Cancelar', f: () => api().post(`ocorrencias-followup`, formDataCancelar).then(response => reload(false)) })
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

        {hasRequestedEventos && hasLoaded && eventoReaberta &&
            <div className='list-item-container'>

                {ocorrencias.map((ocorrencia, id) => {

                    let options = getItenOptions(ocorrencia, 'ocorrencias', setHasLoaded)

                    return <div key={id} className='list-item-card'>
                        <div className='list-item-card-content'>
                            <Link to={`/ocorrencias/${ocorrencia.id}`}>
                                <h1>{ocorrencia.assunto}</h1>
                                <p>Apartamento: {ocorrencia.apartamento.numero} {ocorrencia.apartamento.bloco}</p>
                                <p>Status: {ocorrencia.deleted_at ? 'Desativada' : ocorrencia.followup[ocorrencia.followup.length - 1].evento.nome}</p>
                            </Link>
                        </div>

                        {permissao.gerenciar && <OptionsBtn options={options} />}
                    </div>
                })}
            </div>

        }
    </div>
}

