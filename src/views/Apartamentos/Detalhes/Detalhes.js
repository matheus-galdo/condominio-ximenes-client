import { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import BackBtn from '../../../components/BackBtn/BackBtn';
import usePermissao from '../../../Hooks/usePermissao';
import api from '../../../Service/api';

export default function Detalhes(props) {

    const [apartamento, setApartamento] = useState({})
    const [hasLoaded, setHasLoaded] = useState(false)
    let { id } = useParams();

    const { permissao } = usePermissao('apartamentos')


    useEffect(() => {
        if (!hasLoaded && !apartamento.permissoes_with_modulo) {
            api().get(`apartamentos/${id}`).then(response => {
                setApartamento(response.data)
                setHasLoaded(true)
            })
        }
    }, [hasLoaded, id, apartamento])


    return <div className='details-wrapper'>
        {permissao.modulo && (!permissao.acessar || !permissao.visualizar) && <Redirect to='/nao-permitido' />}

        <BackBtn to='/apartamentos' />

        {hasLoaded && <>

            <h1>Apartamento {apartamento.numero} </h1>

            <h3>Detalhes</h3>
            <p><span className='bold'>Bloco: </span> {apartamento.bloco}</p>
            <p><span className='bold'>Andar: </span> {apartamento.andar}° andar</p>

            <h3>Proprietários</h3>
            <div className='square-list'>
                {apartamento.proprietarios.length > 0 ? apartamento.proprietarios.map((item, key) => <div key={key} className='square-list__item-clickable'>
                    <Link className='square-list__item-content' to={`/proprietarios/${item.id}`}>
                        <span className='square-list__number-block'>{key + 1}</span>
                        <p>
                            {item.name}<br />
                        </p>

                    </Link>
                    <Link to={`/proprietarios/${item.id}`} className='square-list__item-details-button'>
                        Ver proprietário
                    </Link>
                </div>)
                    :
                    <div className='square-list__item'>
                        <div className='square-list__item-content'>
                            <p>
                                <span>Nenhum proprietário encontrado</span>
                            </p>

                        </div>
                    </div>}
            </div>
        </>}

    </div>
}