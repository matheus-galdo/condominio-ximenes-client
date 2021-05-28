import { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router';
import BackBtn from '../../../components/BackBtn/BackBtn';
import usePermissao from '../../../Hooks/usePermissao';
import api from '../../../Service/api';

export default function Detalhes(props) {

    const [usuario, setUsuario] = useState({})
    const [hasLoaded, setHasLoaded] = useState(false)
    let { id } = useParams();

    const { permissao } = usePermissao('usuarios')


    useEffect(() => {
        if (!hasLoaded) {
            api().get(`usuarios/${id}`).then(response => {
                setHasLoaded(true)
                setUsuario(response.data)
            })
        }
    }, [hasLoaded, id, usuario])


    return <div className='details-wrapper'>
        {permissao.modulo && (!permissao.acessar || !permissao.visualizar) && <Redirect to='/nao-permitido' />}

        <BackBtn />

        {hasLoaded && <>

            <h1>{usuario.name}</h1>            
            <h3>Detalhes</h3>
            <p><span className='bold'>E-mail: </span> {usuario.email}</p>
            <p><span className='bold'>Tipo de permissão: </span> {usuario.typeName}</p>

        </>}

    </div>
}