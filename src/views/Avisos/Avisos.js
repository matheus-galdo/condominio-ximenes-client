import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import BackBtn from '../../components/BackBtn/BackBtn';
import FilterBy from '../../components/FilterBy/FilterBy';
import OptionsBtn from '../../components/OptionsBtn/OptionsBtn';
import Pagination from '../../components/Pagination/Pagination';
import SearchBar from '../../components/SearchBar/SearchBar';
import usePermissao from '../../Hooks/usePermissao';
import api from '../../Service/api';
import './Avisos.scss';

export default function Avisos(props) {

    const [avisos, setAvisos] = useState([])
    const [hasLoaded, setHasLoaded] = useState(false)
    const history = useHistory();
    const { permissao } = usePermissao('avisos')


    const [page, setPage] = useState(1)
    const [orderBy, setOrderBy] = useState('data_cadastro_recentes')
    const [originalData, setOriginalData] = useState(null)

    const [filterOptions] = useState([
        { nome: 'Cadastro mais recente', f: () => { setOrderBy('data_cadastro_recentes'); setHasLoaded(false) } },
        { nome: 'Cadastro mais antigo', f: () => { setOrderBy('data_cadastro_antigas'); setHasLoaded(false) } },
        { nome: 'Título', f: () => { setOrderBy('titulo'); setHasLoaded(false) } },
        { nome: 'Expira', f: () => { setOrderBy('expira'); setHasLoaded(false) } },
        { nome: 'Não expira', f: () => { setOrderBy('nao_expira'); setHasLoaded(false) } },
        { nome: 'Data de expiração', f: () => { setOrderBy('data_expiracao'); setHasLoaded(false) } },
        { nome: 'Desativados', f: () => { setOrderBy('desativado'); setHasLoaded(false) } },
        { nome: 'Ativados', f: () => { setOrderBy('ativado'); setHasLoaded(false) } },
        { nome: 'Todos', f: () => { setOrderBy('todos'); setHasLoaded(false) } },
    ])


    useEffect(() => {
        document.title = "Avisos"
    }, []);

    useEffect(() => {
        let mounted = true
        if (!hasLoaded) {
            api().get(`avisos?page=${page}&filter=${orderBy}`).then(response => {
                if (mounted) {
                    setHasLoaded(true)
                    setAvisos(response.data.data)
                    setOriginalData(response.data)
                }
            })
        }

        return () => mounted = false
    }, [hasLoaded, filterOptions, page])


    function changePage(value) {
        setHasLoaded(false)
        setPage(value)
    }

    function filter(e, value) {
        api().get(`avisos?page=${page}&filter=${orderBy}&search=${value}`).then(response => {
            setHasLoaded(true)
            setAvisos(response.data.data)
            setOriginalData(response.data)
        })
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
        <FilterBy options={filterOptions} />

        <div className='list-item-container'>

            {avisos.map((aviso, id) => {

                let options = getItenOptions(aviso, 'avisos', setHasLoaded)

                let expirado = false
                let dateExpiration = aviso.data_expiracao;

                if (dateExpiration) {
                    expirado = moment() >= moment(dateExpiration)
                }

                return <div key={id} className='list-item-card'>
                    <div className='list-item-card-content'>
                        <Link to={'/avisos/' + aviso.id}>
                            <h1>{aviso.titulo}</h1>
                            <p>Cadastrado em: {moment(aviso.created_at).format('L')}</p>
                            <p>{expirado ? 'Expirou em' : 'Expira em'}: {dateExpiration ? moment(dateExpiration).format('L') : ' Não expira'}
                            </p>
                            {permissao.gerenciar && <p>Status: {aviso.deleted_at ? 'Desativado' : 'Ativado'}</p>}
                        </Link>
                    </div>

                    {permissao.gerenciar && <OptionsBtn options={options} />}
                </div>
            })}

        </div>
        {(originalData || hasLoaded) && <Pagination itens={originalData} setPage={changePage} page={page} />}


    </div>
}