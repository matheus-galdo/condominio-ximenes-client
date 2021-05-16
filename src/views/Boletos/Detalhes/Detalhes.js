import moment from 'moment';
import { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import BackBtn from '../../../components/BackBtn/BackBtn';
import usePermissao from '../../../Hooks/usePermissao';
import api from '../../../Service/api';
import ClipboardBtn from '../../../components/ClipboardBtn/ClipboardBtn';
import { numberFormat } from '../../../libs/helpers';




export default function Detalhes(props) {

    const [boleto, setBoleto] = useState(null)
    const [hasLoaded, setHasLoaded] = useState(false)
    let { id } = useParams();

    const { permissao } = usePermissao('boletos')


    useEffect(() => {
        let mounted = true
        if (!hasLoaded) {
            api().get(`boletos/${id}`).then(response => {
                if (mounted) {
                    setHasLoaded(true)
                    setBoleto(response.data)
                }
            })
        }

        return () => mounted = false
    }, [hasLoaded, id, boleto])


    return <div className='details-wrapper'>
        {permissao.modulo && (!permissao.acessar || !permissao.visualizar) && <Redirect to='/nao-permitido' />}

        <BackBtn to='/boletos' />

        {hasLoaded && boleto && <>

            {console.log(boleto)}
            <h1>{boleto.nome} </h1>

            <h3>Detalhes</h3>
            <p>
                <span className='bold'>Código de barras: </span>{boleto.codigo_barras}
                <ClipboardBtn value={boleto.codigo_barras}/>
            </p>
            
            <p><span className='bold'>Valor: </span> {numberFormat(boleto.valor, 'real')}</p>
            <p><span className='bold'>Vencimento: </span> {moment(boleto.vencimento).format('L')}</p>
            {boleto.deleted_at && <p><span className='bold'>Desativado em: </span> {moment(boleto.deleted_at).format('L')}</p>}

            <h3>Pagamento</h3>
            <p><span className='bold'>Status de pagamento: </span> {boleto.pago ? ' Pago' : 'Em aberto'}</p>
            {boleto.pago && <p><span className='bold'>Data do pagamento: </span> {moment(boleto.data_pagamento).format('L')}</p>}

            <h3>Cadastro</h3>
            <p><span className='bold'>Cadastrado por: </span> {boleto.cadastrado_por.name}</p>
            <p><span className='bold'>Data do cadastro: </span> {moment(boleto.created_at).format('L')}</p>

            <h3>Apartamento</h3>
            <div className='square-list__item-clickable'>
                <Link className='square-list__item-content' to={`/apartamentos/${boleto.apartamento.id}`}>
                    <span className='square-list__number-block'>{1}</span>
                    <p>
                        Apartamento {boleto.apartamento.numero}<br />
                        <span>Bloco: {boleto.apartamento.bloco}</span><br />
                        <span>{boleto.apartamento.andar}° andar</span>
                    </p>

                </Link>
                <Link to={`/apartamentos/${boleto.apartamento.id}`} className='square-list__item-details-button'>
                    Ver apartamento
                </Link>
            </div>
        </>}
    </div>
}