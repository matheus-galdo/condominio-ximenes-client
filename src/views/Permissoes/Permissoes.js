import { useEffect, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import BackBtn from '../../components/BackBtn/BackBtn';
import FilterBy from '../../components/FilterBy/FilterBy';
import OptionsBtn from '../../components/OptionsBtn/OptionsBtn';
import Pagination from '../../components/Pagination/Pagination';
import SearchBar from '../../components/SearchBar/SearchBar';
import usePermissao from '../../Hooks/usePermissao';
import api from '../../Service/api';

export default function Permissoes(props) {

    const [permissoes, setPermissoes] = useState([])
    const [hasLoaded, setHasLoaded] = useState(false)
    const history = useHistory();

    const { permissao } = usePermissao('permissoes')

    const [originalData, setOriginalData] = useState(null)
    const [page, setPage] = useState(1)
    const [orderBy, setOrderBy] = useState('data_cadastro_recentes')

    const [filterOptions] = useState([
        { nome: 'Cadastro mais recente', f: () => { setOrderBy('data_cadastro_recentes'); setHasLoaded(false) } },
        { nome: 'Cadastro mais antigo', f: () => { setOrderBy('data_cadastro_antigas'); setHasLoaded(false) } },
        { nome: 'Nome', f: () => { setOrderBy('nome'); setHasLoaded(false) } },
        { nome: 'Permissão de admin', f: () => { setOrderBy('is_admin'); setHasLoaded(false) } },
        { nome: 'Desativados', f: () => { setOrderBy('desativado'); setHasLoaded(false) } },
        { nome: 'Ativados', f: () => { setOrderBy('ativado'); setHasLoaded(false) } },
        { nome: 'Todos', f: () => { setOrderBy('todos'); setHasLoaded(false) } },
    ])

    useEffect(() => {
        let mounted = true
        if (!hasLoaded) {
            api().get(`permissoes?page=${page}&filter=${orderBy}`).then(response => {
                if (mounted) {
                    setHasLoaded(true)
                    setPermissoes(response.data.data)
                    setOriginalData(response.data)
                }
            })
        }
        return () => mounted = false
    }, [hasLoaded])

    useEffect(() => {
        document.title = "Permissões"
    }, []);

    function changePage(value) {
        setHasLoaded(false)
        setPage(value)
    }

    function filter(e, value) {
        setPage(1)
        api().get(`permissoes?page=${1}&filter=${orderBy}&search=${value}`).then(response => {
            setHasLoaded(true)
            setPermissoes(response.data.data)
            setOriginalData(response.data)
        })
    }


    function getItenOptions(permissaoItem, moduloName, reload) {

        let options = []

        if (permissao.editar) options.push({ name: 'Editar', f: () => history.push(`/${moduloName}/cadastro/` + permissaoItem.id) })

        if (permissaoItem.deleted_at) {
            options.push({ name: 'Ativar', f: () => api().put(`${moduloName}/${permissaoItem.id}`, { ativar: true }).then(response => reload(false)) })
        } else {
            options.push({ name: 'Desativar', f: () => api().put(`${moduloName}/${permissaoItem.id}`, { ativar: false }).then(response => reload(false)) })
        }

        if (permissao.excluir && permissaoItem.deleted_at) {
            options.push({ name: 'Excluir', f: () => api().delete(`${moduloName}/${permissaoItem.id}`).then(response => reload(false)) })
        }

        return options
    }

    return <div className='module-wrapper'>

        {permissao.modulo && !permissao.acessar && <Redirect to='/dashboard' />}
        <BackBtn />

        <h1>Permissões</h1>

        <div className='top-module-bar'>
            <SearchBar filter={filter} />
            {permissao.criar && <Link to='/permissoes/cadastro/' className='btn-primary'>
                + Adicionar
            </Link>}
        </div>
        <FilterBy options={filterOptions} />


        <div className='list-item-container'>
            {permissoes && permissoes.map((permissaoItem, id) => {

                let options = getItenOptions(permissaoItem, 'permissoes', setHasLoaded)

                return <div key={id} className='list-item-card'>
                    <div className='list-item-card-content'>
                        <Link to={'/permissoes/' + permissaoItem.id}>
                            <h1>{permissaoItem.nome}</h1>
                            <p>Permissão de admin: {permissaoItem.is_admin ? 'Sim' : 'Não'}</p>
                            <p>Status: {permissaoItem.deleted_at ? 'Desativado' : 'Ativado'}</p>
                        </Link>
                    </div>

                    {permissao.gerenciar && <OptionsBtn options={options} />}
                </div>
            })}
        </div>

        {(originalData || hasLoaded) && <Pagination itens={originalData} setPage={changePage} page={page} />}

    </div>
}