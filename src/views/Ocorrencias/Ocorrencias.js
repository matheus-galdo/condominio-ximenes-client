import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import BackBtn from '../../components/BackBtn/BackBtn';
import FilterBy from '../../components/FilterBy/FilterBy';
import OptionsBtn from '../../components/OptionsBtn/OptionsBtn';
import Pagination from '../../components/Pagination/Pagination';
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


    const [ocorrencias, setOcorrencias] = useState([])
    const [hasLoaded, setHasLoaded] = useState(false)

    const { permissao } = usePermissao('ocorrencias')

    const [page, setPage] = useState(1)
    const [orderBy, setOrderBy] = useState('data_cadastro_recentes')
    const [originalData, setOriginalData] = useState(null)

    const [filterOptions] = useState([
        { nome: 'Cadastro mais recente', f: () => { setOrderBy('data_cadastro_recentes'); setHasLoaded(false) } },
        { nome: 'Cadastro mais antigo', f: () => { setOrderBy('data_cadastro_antigas'); setHasLoaded(false) } },
        { nome: 'Assunto', f: () => { setOrderBy('assunto'); setHasLoaded(false) } },
        { nome: 'Ativadas', f: () => { setOrderBy('ativado'); setHasLoaded(false) } },
        { nome: 'Todas', f: () => { setOrderBy('todos'); setHasLoaded(false) } },
        { nome: 'Concluídas', f: () => { setOrderBy('concluidas'); setHasLoaded(false) } },
        { nome: 'Canceladas', f: () => { setOrderBy('canceladas'); setHasLoaded(false) } },
        { nome: 'Desativadas', f: () => { setOrderBy('desativado'); setHasLoaded(false) } },
    ])


    useEffect(() => {
        let mounted = true
        if (!hasLoaded) {
            api().get(`ocorrencias?page=${page}&filter=${orderBy}`).then(response => {

                if (mounted) {
                    setHasLoaded(true)
                    setOcorrencias(response.data.data)
                    setOriginalData(response.data)
                }
            })
        }

        return () => mounted = false
    }, [hasLoaded, page, orderBy])


    useEffect(() => {
        document.title = "Ocorrências"
    }, []);

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


    function changePage(value) {
        setHasLoaded(false)
        setPage(value)
    }

    function filter(e, value) {
        setPage(1)
        api().get(`ocorrencias?page=${1}&filter=${orderBy}&search=${value}`).then(response => {
            setHasLoaded(true)
            setOcorrencias(response.data.data)
            setOriginalData(response.data)
        })
    }

    function getItenOptions(item, moduloName, reload) {

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
        <FilterBy options={filterOptions} />

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
        {(originalData || hasLoaded) && <Pagination itens={originalData} setPage={changePage} page={page} />}
    </div>
}

