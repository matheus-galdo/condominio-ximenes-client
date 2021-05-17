import { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import BackBtn from '../../../components/BackBtn/BackBtn';
import usePermissao from '../../../Hooks/usePermissao';
import api from '../../../Service/api';

export default function Detalhes(props) {

    const [usuario, setUsuario] = useState({})
    const [hasLoaded, setHasLoaded] = useState(false)
    let { id } = useParams();

    const { permissao } = usePermissao('proprietarios')


    useEffect(() => {
        let mounted = true
        if (!hasLoaded && !usuario.permissoes_with_modulo) {
            api().get(`proprietarios/${id}`).then(response => {
                if (mounted) {
                    setUsuario(response.data)
                    setHasLoaded(true)
                }
            })
        }
        return () => mounted = false
    }, [hasLoaded, id, usuario])


    return <div className='details-wrapper'>
        {permissao.modulo && (!permissao.acessar || !permissao.visualizar) && <Redirect to='/nao-permitido' />}

        <BackBtn />

        {hasLoaded && <>

            <h1>{usuario.name}</h1>

            <h3>Detalhes</h3>
            <p><span className='bold'>E-mail: </span> {usuario.email}</p>
            <p><span className='bold'>Tipo de permissão: </span> {usuario.typeName}</p>

            <h3>Apartamentos</h3>
            <div className='square-list'>
                {usuario.apartamentos.length > 0 ? usuario.apartamentos.map((item, key) => <div key={key} className='square-list__item-clickable'>
                    <Link className='square-list__item-content' to={`/apartamentos/${item.id}`}>
                        <span className='square-list__number-block'>{key + 1}</span>
                        <p>
                            Apartamento {item.numero}<br />
                            <span>Bloco: {item.bloco}</span><br />
                            <span>{item.andar}° andar</span>
                        </p>

                    </Link>
                    <Link to={`/apartamentos/${item.id}`} className='square-list__item-details-button'>
                        Ver apartamento
                    </Link>
                </div>)
                    :
                    <div className='square-list__item'>
                        <div className='square-list__item-content'>
                            <p>
                                <span>
                                    Apartamento solicitado:
                                </span>
                                {usuario.apartamento_solicitado ? `${usuario.apartamento_solicitado}` : 'Nenhum apartamento encontrado'}
                            </p>
                        </div>
                    </div>}
            </div>

        </>}

    </div>
}