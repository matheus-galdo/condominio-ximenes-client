import { useEffect, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import BackBtn from '../../components/BackBtn/BackBtn';
import OptionsBtn from '../../components/OptionsBtn/OptionsBtn';
import SearchBar from '../../components/SearchBar/SearchBar';
import usePermissao from '../../Hooks/usePermissao';
import api from '../../Service/api';


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

export default function Boletos(props) {

    const [documentosOriginal, setDocumentosOriginal] = useState([])
    const [documentos, setDocumentos] = useState([])
    const [hasLoaded, setHasLoaded] = useState(false)

    const history = useHistory();
    const { permissao } = usePermissao('documentos')


    useEffect(() => {
        let mounted = true;

        if (!hasLoaded && documentosOriginal.length === 0) {
            api().get('documentos').then(response => {
                if (mounted) {
                    setDocumentosOriginal(response.data)
                    setDocumentos(response.data)
                    setHasLoaded(true)
                }
            })
        }

        return () => {
            mounted = false
        }
    }, [documentos, hasLoaded, documentosOriginal])


    function filter(e) {
        let value = e.target.value.toLowerCase()

        if (value === '') {
            setDocumentos(documentosOriginal);
            return
        }

        let filtered = documentosOriginal.filter(documento =>
            (documento.nome.toLowerCase().indexOf(value) >= 0) ||
            (documento.nome_original.toLowerCase().indexOf(value) >= 0)
        )

        setDocumentos(filtered);
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


    </div>
}