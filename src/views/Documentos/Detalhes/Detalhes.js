import moment from 'moment';
import { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router';
import { bytesToSize } from '../../../assets/Helpers/helpers';
import BackBtn from '../../../components/BackBtn/BackBtn';
import usePermissao from '../../../Hooks/usePermissao';
import api from '../../../Service/api';
import './Detalhes.scss';

export default function Detalhes(props) {

    const [expirado, setExpirado] = useState(false)
    const [dataExpiracao, setDataExpiracao] = useState(false)
    const [documento, setDocumento] = useState({})
    const [hasLoaded, setHasLoaded] = useState(false)
    let { id } = useParams();
    
    const { permissao } = usePermissao('documentos')


    useEffect(() => {
        let mounted = true
        if (!hasLoaded) {
            api().get(`documentos/${id}`).then(response => {
                if (mounted) {
                    setHasLoaded(true)
                    setDocumento(response.data)

                    let dateExpiration = response.data.data_expiracao;                    
                    if (dateExpiration) {
                        setExpirado(moment() >= moment(dateExpiration))
                        setDataExpiracao(moment(dateExpiration).format('DD/MM/YY'))
                    }
                }
            })
        }

        return () => mounted = false
    }, [hasLoaded, id, documento])


    return <div className='details-wrapper'>
        {permissao.modulo && (!permissao.acessar || !permissao.visualizar) && <Redirect to='/nao-permitido' />}

        <BackBtn to='/documentos' />

        {hasLoaded && <>

            <h1>{documento.nome} </h1>

            <h3>Detalhes</h3>
            <p><span className='bold'>Nome original: </span> {documento.nome_original}</p>
            <p><span className='bold'>Tamano do arquivo: </span> {bytesToSize(documento.size)}</p>
            <p><span className='bold'>{expirado ? 'Expirou em' : 'Expira em'}: </span>                 
                {dataExpiracao ?  moment(documento.data_expiracao).format('L') : ' Não expira'}
            </p>
            <p><span className='bold'>Publicado em: </span> {moment(documento.updated_at).format('L')}</p>
            {documento.deleted_at && <p><span className='bold'>Desativado em: </span> {moment(documento.deleted_at).format('L')}</p>}
            
            
        </>}

    </div>
}