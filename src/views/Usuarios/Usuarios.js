import { useEffect, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import BackBtn from '../../components/BackBtn/BackBtn';
import FilterBy from '../../components/FilterBy/FilterBy';
import OptionsBtn from '../../components/OptionsBtn/OptionsBtn';
import Pagination from '../../components/Pagination/Pagination';
import SearchBar from '../../components/SearchBar/SearchBar';
import usePermissao from '../../Hooks/usePermissao';
import api from '../../Service/api';

export default function Usuarios(props) {

    const [usuarios, setUsuarios] = useState([])
    const [hasLoaded, setHasLoaded] = useState(false)

    const history = useHistory();
    const { permissao } = usePermissao('usuarios')

    const [originalData, setOriginalData] = useState(null)
    const [page, setPage] = useState(1)
    const [orderBy, setOrderBy] = useState('data_cadastro_recentes')

    const [filterOptions] = useState([
        { nome: 'Cadastro mais recente', f: () => { setOrderBy('data_cadastro_recentes'); setHasLoaded(false) } },
        { nome: 'Cadastro mais antigo', f: () => { setOrderBy('data_cadastro_antigas'); setHasLoaded(false) } },
        { nome: 'Nome', f: () => { setOrderBy('name'); setHasLoaded(false) } },
        { nome: 'Tipo de usuário', f: () => { setOrderBy('user_type'); setHasLoaded(false) } },
        { nome: 'Desativados', f: () => { setOrderBy('desativado'); setHasLoaded(false) } },
        { nome: 'Ativados', f: () => { setOrderBy('ativado'); setHasLoaded(false) } },
        { nome: 'Todos', f: () => { setOrderBy('todos'); setHasLoaded(false) } },
    ])

    useEffect(() => {
        let mounted = true
        if (!hasLoaded) {
            api().get(`usuarios?page=${page}&filter=${orderBy}`).then(response => {
                if (mounted) {
                    setHasLoaded(true)
                    setUsuarios(response.data.data)
                    setOriginalData(response.data)
                }
            })
        }

        return () => mounted = false
    }, [usuarios, hasLoaded])

    useEffect(() => {
        document.title = "Usuários"
    }, []);

    function filter(e, value) {
        setPage(1)
        api().get(`usuarios?page=${1}&filter=${orderBy}&search=${value}`).then(response => {
            setHasLoaded(true)
            setUsuarios(response.data.data)
            setOriginalData(response.data)
        })
    }


    function changePage(value) {
        setHasLoaded(false)
        setPage(value)
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

        <h1>Usuários</h1>

        <div className='top-module-bar'>
            <SearchBar filter={filter} />

            {permissao.criar && <Link to='/usuarios/cadastro/' className='btn-primary'>
                + Adicionar
            </Link>}
        </div>
        <FilterBy options={filterOptions} />



        <div className='list-item-container'>

            {usuarios.map((usuario, id) => {

                let options = getItenOptions(usuario, 'usuarios', setHasLoaded)

                return <div key={id} className='list-item-card'>
                    <div className='list-item-card-content'>
                        <Link to={`/usuarios/${usuario.id}`}>
                            <h1>{usuario.name}</h1>
                            <p>Tipo: {usuario.type_name.nome}</p>
                            <p>Status: {usuario.deleted_at ? 'Desativado' : 'Ativado'}</p>
                        </Link>
                    </div>

                    {permissao.gerenciar && <OptionsBtn options={options} />}
                </div>
            })}
        </div>

        {(originalData || hasLoaded) && <Pagination itens={originalData} setPage={changePage} page={page} />}

    </div>
}