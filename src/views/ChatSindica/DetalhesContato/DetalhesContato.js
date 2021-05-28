import './DetalhesContato.scss';
import { Link } from 'react-router-dom';
import { MdClose } from "react-icons/md"

export default function DetalhesContato(props) {

    return <aside className={' details-wrapper chat-details-container' + (props.showDetails ? ' enabled' : ' disabled')}>
        {props.contato &&
            <>
                <div className="btn-container">
                    <button onClick={() => props.setShowDetails(false)}>
                        <MdClose/>
                    </button>
                </div>
                <h1><Link to={`/proprietarios/${props.contato.proprietario_id}`}>{props.contato.name}</Link></h1>

                <h3>Contatos</h3>
                <p><span className="bold">E-mail: </span>{props.contato.email}</p>
                <p><span className="bold">Telefone: </span>{props.contato.telefone}</p>


                <h3>Apartamentos</h3>
                <div className='square-list'>
                    {'apartamentos' in props.contato && props.contato.apartamentos.map((item, key) => <div key={key} className='square-list__item-clickable'>
                        <Link className='square-list__item-content' to={`/apartamentos/${item.id}`}>
                            <span className='square-list__number-block'>{key + 1}</span>
                            <p>
                                Apartamento {item.numero}<br />
                                <span>Bloco: {item.bloco}</span><br />
                                <span>{item.andar}° andar</span>
                            </p>
                        </Link>
                    </div>)}
                </div>
            </>
        }
    </aside>
}