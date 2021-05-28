import { useEffect, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import BackBtn from '../../components/BackBtn/BackBtn';
import OptionsBtn from '../../components/OptionsBtn/OptionsBtn';
import SearchBar from '../../components/SearchBar/SearchBar';
import usePermissao from '../../Hooks/usePermissao';
import api from '../../Service/api';
import './Documentos.scss';
import './Contas.scss';
import moment from 'moment';
import Pagination from '../../components/Pagination/Pagination';
import FilterBy from '../../components/FilterBy/FilterBy';


function downloadFile(e, documento) {
    e.preventDefault()
    api(false, 'blob').get(`download-file?file=${documento.id}&module=contas`).then(response => {

        let filename = 'file.txt'
        try {
            filename = response.headers['content-disposition'].split(';')[1].split('=')[1]
        } catch (error) {

        }

        let url = URL.createObjectURL(new Blob([response.data]));
        let a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url)
    })
}

export default function Contas(props) {

    const [contas, setContas] = useState([])
    const [hasLoaded, setHasLoaded] = useState(false)

    const history = useHistory();
    const { permissao } = usePermissao('prestacao-contas')

    const [originalData, setOriginalData] = useState(null)
    const [page, setPage] = useState(1)
    const [orderBy, setOrderBy] = useState('data_cadastro_recentes')

    const [filterOptions] = useState([
        { nome: 'Cadastro mais recente', f: () => { setOrderBy('data_cadastro_recentes'); setHasLoaded(false) } },
        { nome: 'Cadastro mais antigo', f: () => { setOrderBy('data_cadastro_antigas'); setHasLoaded(false) } },
        { nome: 'Nome arquivo', f: () => { setOrderBy('nome'); setHasLoaded(false) } },
        { nome: 'Periodo', f: () => { setOrderBy('periodo'); setHasLoaded(false) } },
        { nome: 'Desativados', f: () => { setOrderBy('desativado'); setHasLoaded(false) } },
        { nome: 'Ativados', f: () => { setOrderBy('ativado'); setHasLoaded(false) } },
        { nome: 'Todos', f: () => { setOrderBy('todos'); setHasLoaded(false) } },
    ])


    useEffect(() => {
        document.title = "Prestação de contas"
    }, []);


    useEffect(() => {
        let mounted = true;
        if (!hasLoaded) {
            api().get(`prestacao-contas?page=${page}&filter=${orderBy}`).then(response => {
                if (mounted) {
                    setHasLoaded(true)
                    setContas(response.data.data)
                    setOriginalData(response.data)
                }
            })
        }
        return () => mounted = false
    }, [contas, hasLoaded, originalData])


    function changePage(value) {
        setHasLoaded(false)
        setPage(value)
    }

    function filter(e, value) {
        setPage(1)
        api().get(`prestacao-contas?page=${1}&filter=${orderBy}&search=${value}`).then(response => {
            setHasLoaded(true)
            setContas(response.data.data)
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

        <h1>Prestação de contas</h1>

        <div className='top-module-bar'>
            <SearchBar filter={filter} />

            {permissao.criar && <Link to='/contas/cadastro/' className='btn-primary'>
                + Adicionar
            </Link>}
        </div>
        <FilterBy options={filterOptions} />


        <div className='list-item-container'>

            {contas.map((conta, id) => {

                let options = getItenOptions(conta, 'contas', setHasLoaded)

                return <div key={id} className='list-item-card'>
                    <Link to={`/contas/${conta.id}`}>

                        <span className='file-icon'>
                            {conta.extensao}
                        </span>
                    </Link>

                    <div className='list-item-card-content'>
                        {permissao.visualizar ?
                            <Link to={`/contas/${conta.id}`}>
                                <h1>Detalhamento de {moment(conta.periodo).format('MMMM YYYY')}</h1>
                                <p>Arquivo: {conta.nome}</p>
                                <p>Status: {conta.deleted_at ? 'Desativado' : 'Ativado'}</p>
                            </Link>
                            :
                            <>
                                <h1>Detalhamento de {moment(conta.periodo).format('MMMM YYYY')}</h1>
                                <p>Arquivo: {conta.nome}</p>
                            </>
                        }
                    </div>

                    <button onClick={e => downloadFile(e, conta)} className='btn-primary small-btn'>
                        Download
                    </button>

                    {permissao.gerenciar && <OptionsBtn options={options} />}
                </div>
            })}
        </div>

        {(originalData || hasLoaded) && <Pagination itens={originalData} setPage={changePage} page={page} />}
    </div>
}