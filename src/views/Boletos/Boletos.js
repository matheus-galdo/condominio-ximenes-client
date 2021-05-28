import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import BackBtn from '../../components/BackBtn/BackBtn';
import FilterBy from '../../components/FilterBy/FilterBy';
import OptionsBtn from '../../components/OptionsBtn/OptionsBtn';
import Pagination from '../../components/Pagination/Pagination';
import SearchBar from '../../components/SearchBar/SearchBar';
import usePermissao from '../../Hooks/usePermissao';
import { numberFormat } from '../../libs/helpers';
import api from '../../Service/api';
import './Boletos.scss'


function downloadFile(e, boleto) {
    e.preventDefault()
    api(false, 'blob').get(`download-file?file=${boleto.id}&module=boleto`).then(response => {
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

    const [boletos, setBoletos] = useState([])
    const [hasLoaded, setHasLoaded] = useState(false)

    const history = useHistory();
    const { permissao } = usePermissao('boletos')

    const [page, setPage] = useState(1)
    const [orderBy, setOrderBy] = useState('data_cadastro_recentes')
    const [originalData, setOriginalData] = useState(null)

    const [filterOptions] = useState([
        { nome: 'Cadastro mais recente', f: () => { setOrderBy('data_cadastro_recentes'); setHasLoaded(false) } },
        { nome: 'Cadastro mais antigo', f: () => { setOrderBy('data_cadastro_antigas'); setHasLoaded(false) } },
        { nome: 'Despesa', f: () => { setOrderBy('nome'); setHasLoaded(false) } },
        { nome: 'Valor', f: () => { setOrderBy('valor'); setHasLoaded(false) } },
        { nome: 'Ativados', f: () => { setOrderBy('ativado'); setHasLoaded(false) } },
        { nome: 'Desativados', f: () => { setOrderBy('desativado'); setHasLoaded(false) } },
        { nome: 'Todos', f: () => { setOrderBy('todos'); setHasLoaded(false) } },
    ])

    useEffect(() => {
        let mounted = true;

        if (!hasLoaded) {
            api().get(`boletos?page=${page}&filter=${orderBy}`).then(response => {
                if (mounted) {
                    setHasLoaded(true)
                    setOriginalData(response.data)
                    setBoletos(response.data.data)
                }
            })
        }

        return () => mounted = false
    }, [boletos, hasLoaded, originalData, page, orderBy])

    useEffect(() => {
        document.title = "Boletos"
    }, []);



    function filter(e, value) {
        setPage(1)
        api().get(`boletos?page=${1}&filter=${orderBy}&search=${value}`).then(response => {
            setHasLoaded(true)
            setOriginalData(response.data)
            setBoletos(response.data.data)
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

        if (!item.pago) {
            options.push({ name: 'Pagamento realizado', f: () => api().put(`${moduloName}/${item.id}`, { pagar: true }).then(response => reload(false)) })
        } else {
            options.push({ name: 'Reverter Pagamento', f: () => api().put(`${moduloName}/${item.id}`, { pagar: false }).then(response => reload(false)) })
        }

        if (permissao.excluir && item.deleted_at) {
            options.push({ name: 'Excluir', f: () => api().delete(`${moduloName}/${item.id}`).then(response => reload(false)) })
        }

        return options
    }


    return <div className='module-wrapper'>

        <BackBtn />
        {permissao.modulo && !permissao.acessar && <Redirect to='/nao-permitido' />}

        <h1>Boletos</h1>

        <div className='top-module-bar'>
            <SearchBar filter={filter} />

            {permissao.criar && <Link to='/boletos/cadastro/' className='btn-primary'>
                + Adicionar
            </Link>}
        </div>
        <FilterBy options={filterOptions} />


        <div className='list-item-container'>

            {boletos.map((boleto, id) => {

                let options = getItenOptions(boleto, 'boletos', setHasLoaded)

                return <div key={id} className='list-item-card'>

                    <div className='list-item-card-date'>
                        <p>{moment(boleto.vencimento).format('DD')}</p>
                        <p>{moment(boleto.vencimento).format('MMM')}</p>
                    </div>

                    <div className='list-item-card-content'>
                        <Link to={`/boletos/${boleto.id}`}>
                            <h1>{boleto.nome}</h1>
                            <p>Apartamento {boleto.apartamento.numero}{boleto.apartamento.bloco}</p>
                            <p>{boleto.pago ? 'Pago' : 'Em aberto'}</p>
                            {permissao.gerenciar && <p>Status: {boleto.deleted_at ? 'Desativado' : 'Ativado'}</p>}
                            <p className='valor-boleto'>{numberFormat(boleto.valor, 'real')}</p>
                        </Link>
                    </div>

                    <button onClick={e => downloadFile(e, boleto)} className='btn-primary small-btn'>
                        Download
                    </button>

                    {permissao.gerenciar && <OptionsBtn options={options} />}
                </div>
            })}
        </div>
        {(originalData || hasLoaded) && <Pagination itens={originalData} setPage={changePage} page={page} />}

    </div>
}