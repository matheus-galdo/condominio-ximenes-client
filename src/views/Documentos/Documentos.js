import { useEffect, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import BackBtn from '../../components/BackBtn/BackBtn';
import FilterBy from '../../components/FilterBy/FilterBy';
import OptionsBtn from '../../components/OptionsBtn/OptionsBtn';
import Pagination from '../../components/Pagination/Pagination';
import SearchBar from '../../components/SearchBar/SearchBar';
import usePermissao from '../../Hooks/usePermissao';
import api from '../../Service/api';
import './Documentos.scss';


function downloadFile(e, documento) {
    e.preventDefault()
    api(false, 'blob').get(`download-file?file=${documento.id}&module=documento`).then(response => {
        console.log(response);

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

export default function Documentos(props) {

    const [documentosOriginal, setDocumentosOriginal] = useState([])
    const [documentos, setDocumentos] = useState([])
    const [hasLoaded, setHasLoaded] = useState(false)

    const history = useHistory();
    const { permissao } = usePermissao('documentos')

    const [page, setPage] = useState(1)
    const [orderBy, setOrderBy] = useState('data_cadastro_recentes')
    const [originalData, setOriginalData] = useState(null)

    const [filterOptions] = useState([
        { nome: 'Cadastro mais recente', f: () => { setOrderBy('data_cadastro_recentes'); setHasLoaded(false) } },
        { nome: 'Cadastro mais antigo', f: () => { setOrderBy('data_cadastro_antigas'); setHasLoaded(false) } },
        { nome: 'Extensão', f: () => { setOrderBy('extensao'); setHasLoaded(false) } },
        { nome: 'Nome', f: () => { setOrderBy('nome'); setHasLoaded(false) } },
        { nome: 'Ativados', f: () => { setOrderBy('ativado'); setHasLoaded(false) } },
        { nome: 'Desativados', f: () => { setOrderBy('desativado'); setHasLoaded(false) } },
        { nome: 'Todas', f: () => { setOrderBy('todos'); setHasLoaded(false) } },
    ])

    useEffect(() => {
        let mounted = true;

        if (!hasLoaded) {
            api().get(`documentos?page=${page}&filter=${orderBy}`).then(response => {
                if (mounted) {
                    setHasLoaded(true)
                    setDocumentos(response.data.data)
                    setDocumentosOriginal(response.data)
                }
            })
        }

        return () => {
            mounted = false
        }
    }, [documentos, hasLoaded, documentosOriginal, page, orderBy])


    useEffect(() => {
        document.title = "Documentos"
    }, []);


    function filter(e, value) {
        setPage(1)
        api().get(`documentos?page=${1}&filter=${orderBy}&search=${value}`).then(response => {
            setHasLoaded(true)
            setDocumentosOriginal(response.data)
            setDocumentos(response.data.data)
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

        <h1>Documentos</h1>

        <div className='top-module-bar'>
            <SearchBar filter={filter} />

            {permissao.criar && <Link to='/documentos/cadastro/' className='btn-primary'>
                + Adicionar
            </Link>}
        </div>
        <FilterBy options={filterOptions} />


        <div className='list-item-container'>

            {documentos.map((documento, id) => {

                let options = getItenOptions(documento, 'documentos', setHasLoaded)

                return <div key={id} className='list-item-card'>
                    <Link to={`/documentos/${documento.id}`}>

                        <span className='file-icon'>
                            {documento.extensao}
                        </span>
                    </Link>

                    <div className='list-item-card-content'>
                        {permissao.visualizar ?
                            <Link to={`/documentos/${documento.id}`}>
                                <h1>{documento.nome}</h1>
                                <p>Status: {documento.deleted_at ? 'Desativado' : 'Ativado'}</p>

                            </Link>
                            :
                            <>
                                <h1>{documento.nome}</h1>
                                <p>Status: {documento.deleted_at ? 'Desativado' : 'Ativado'}</p>
                            </>
                        }
                    </div>

                    <button onClick={e => downloadFile(e, documento)} className='btn-primary small-btn'>
                        Download
                    </button>

                    {permissao.gerenciar && <OptionsBtn options={options} />}
                </div>
            })}
        </div>

        {(originalData || hasLoaded) && <Pagination itens={originalData} setPage={changePage} page={page} />}

    </div>
}