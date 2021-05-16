import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import BackBtn from '../../components/BackBtn/BackBtn';
import OptionsBtn from '../../components/OptionsBtn/OptionsBtn';
import SearchBar from '../../components/SearchBar/SearchBar';
import usePermissao from '../../Hooks/usePermissao';
import api from '../../Service/api';


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

    const [boletosOriginal, setBoletosOriginal] = useState([])
    const [boletos, setBoletos] = useState([])
    const [hasLoaded, setHasLoaded] = useState(false)

    const history = useHistory();
    const { permissao } = usePermissao('boletos')


    useEffect(() => {
        let mounted = true;

        if (!hasLoaded) {
            api().get('boletos').then(response => {
                if (mounted) {
                    setHasLoaded(true)
                    setBoletosOriginal(response.data)
                    setBoletos(response.data)
                }
            })
        }

        return () => {
            mounted = false
        }
    }, [boletos, hasLoaded, boletosOriginal])


    function filter(e) {
        let value = e.target.value.toLowerCase()

        if (value === '') {
            setBoletos(boletosOriginal);
            return
        }

        let filtered = boletosOriginal.filter(boleto =>
            (boleto.nome.toLowerCase().indexOf(value) >= 0) ||
            (boleto.nome_original.toLowerCase().indexOf(value) >= 0)
        )

        setBoletos(filtered);
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


        <div className='list-item-container'>

            {boletos.map((boleto, id) => {

                let options = getItenOptions(boleto, 'boletos', setHasLoaded)

                return <div key={id} className='list-item-card'>

                    <div className='list-item-card-date'>
                        <p>{moment(boleto.vencimento).format('DD')}</p>
                        <p>{moment(boleto.vencimento).format('MMM')}</p>
                    </div>

                    <div className='list-item-card-content'>
                        {permissao.visualizar ?
                            <Link to={`/boletos/${boleto.id}`}>
                                <h1>{boleto.nome}</h1>
                                <p>Apartamento {boleto.apartamento.numero}{boleto.apartamento.bloco}</p>
                                <p>{boleto.pago ? 'Pago' : 'Em aberto'}</p>
                                <p>Status: {boleto.deleted_at ? 'Desativado' : 'Ativado'}</p>

                            </Link>
                            :
                            <>
                                <h1>{boleto.nome}</h1>
                                <p>{boleto.pago ? 'Pago' : 'Em aberto'}</p>
                                <p>{boleto.codigo_barras}</p>
                            </>
                        }
                    </div>

                    <button onClick={e => downloadFile(e, boleto)} className='btn-primary small-btn'>
                        Download
                    </button>

                    {permissao.gerenciar && <OptionsBtn options={options} />}
                </div>
            })}
        </div>


    </div>
}