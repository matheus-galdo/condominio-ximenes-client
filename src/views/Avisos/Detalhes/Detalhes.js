"use strict"
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import BackBtn from '../../../components/BackBtn/BackBtn';
import usePermissao from '../../../Hooks/usePermissao';
import api from '../../../Service/api';
import ClipboardBtn from '../../../components/ClipboardBtn/ClipboardBtn';
import { numberFormat } from '../../../libs/helpers';


import './Detalhes.scss';


export default function Detalhes(props) {

    const [aviso, setAviso] = useState(null)
    const [expirado, setExpirado] = useState(false)
    const [dataExpiracao, setDataExpiracao] = useState(false)

    const [hasLoaded, setHasLoaded] = useState(false)

    const { id } = useParams();
    const { permissao } = usePermissao('avisos')


    useEffect(() => {
        let mounted = true
        if (!hasLoaded) {
            api().get(`avisos/${id}`).then(response => {
                if (mounted) {
                    setHasLoaded(true)
                    setAviso(response.data)

                    let dateExpiration = response.data.data_expiracao;
                    if (dateExpiration) {
                        setExpirado(moment() >= moment(dateExpiration))
                        setDataExpiracao(moment(dateExpiration).format('DD/MM/YY'))
                    }
                }
            })
        }

        return () => mounted = false
    }, [hasLoaded, id, aviso])


    return <div className='details-wrapper'>
        {permissao.modulo && (!permissao.acessar || !permissao.visualizar) && <Redirect to='/nao-permitido' />}

        <BackBtn to='/avisos' />

        {hasLoaded && aviso && <>
            <h1>{aviso.titulo} </h1>
            <p>{aviso.descricao}</p>

            {permissao.gerenciar && <>
                <h3>Detalhes</h3>
                {aviso.deleted_at && <p><span className='bold'>Desativado em: </span> {moment(aviso.deleted_at).format('L')}</p>}

                <p><span className='bold'>{expirado ? 'Expirou em' : 'Expira em'}: </span>
                    {dataExpiracao ? moment(aviso.data_expiracao).format('L') : ' Não expira'}
                </p>

                <h3>Cadastro</h3>
                <p><span className='bold'>Cadastrado por: </span> {aviso.user_id}</p>
                <p><span className='bold'>Data do cadastro: </span> {moment(aviso.created_at).format('L')}</p>
            </>}
        </>}
    </div>
}