import { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import BackBtn from '../../../components/BackBtn/BackBtn';
import OptionsBtn from '../../../components/OptionsBtn/OptionsBtn';
import SearchBar from '../../../components/SearchBar/SearchBar';
import usePermissao from '../../../Hooks/usePermissao';
import api from '../../../Service/api';
import './ListaContatos.scss';
import { dateFormater } from '../../../assets/Helpers/helpers';




export default function ListaContatos(props) {

    const [contatos, setContatos] = useState(props.contatos || [])
    const { permissao } = usePermissao('chat-sindica')


    useEffect(() => {
        setContatos(props.contatos)
    }, [props.contatos])

    function filter(e) {
        let value = e.target.value.toLowerCase()

        if (value === '') {
            setContatos(props.contatos);
            return
        }

        let filtered = props.contatos.filter(proprietario => {
            let nome = (proprietario.name.toLowerCase().indexOf(value) >= 0)
            let email = (proprietario.email.toLowerCase().indexOf(value) >= 0)
            let telefone = (proprietario.telefone.toLowerCase().indexOf(value) >= 0)
            let aps = (proprietario.apartamentos.filter(ap =>
                (ap.numero.toLowerCase().indexOf(value) >= 0) ||
                (ap.bloco.toLowerCase().indexOf(value) >= 0) ||
                (ap.andar.toLowerCase().indexOf(value) >= 0)
            ))

            return (nome || email || telefone || aps.length > 0)
        })

        setContatos(filtered);
    }

    function getItenOptions(item, moduloName) {

        let options = []

        if (permissao.excluir) {
            options.push({
                name: 'Limpar conversa', f: (e) => api().delete(`${moduloName}/${item.chat.id}`).then(
                    response => {
                        props.updateContato()
                        props.openChat(e, null)
                    }
                )
            })
        }

        return options
    }



    return <div className={'contatos-container' + (props.showContatos ? ' enabled' : ' disabled')}>
        <BackBtn />
        <section className='proprietario-list-container'>

            <div className='proprietario-card'>

            </div>
        </section>



        {permissao.modulo && !permissao.acessar && <Redirect to='/nao-permitido' />}

        <div className='top-module-bar'>
            <SearchBar filter={filter} event='onKeyUp' placeholder="Filtrar contatos" />
        </div>


        <div className='list-item-container chat-contatos-wrapper'>

            {contatos.map((contato, id) => {

                let options = getItenOptions(contato, 'chat-sindica')

                return (

                    <div key={id} className='list-item-card chat-card'>
                        {contato.chat ?
                            <>
                                <div className='list-item-card-content' onClick={e => props.openChat(e, contato)}>
                                    <h1>{contato.name}</h1>
                                    {'ultima_mensagem' in contato.chat && <p>{contato.chat.ultima_mensagem.mensagem}</p>}
                                </div>

                                <div className='contatos-options-container'>
                                    {permissao.gerenciar && <OptionsBtn options={options} />}
                                    <p className='contato-last-message-date'>
                                        {'ultima_mensagem' in contato.chat && dateFormater(contato.chat.ultima_mensagem.created_at)}
                                    </p>
                                </div>
                            

                            </>
                            :
                            <>
                                <div className='list-item-card-content' onClick={e => props.openChat(e, contato)}>
                                    <h1>{contato.name}</h1>
                                </div>
                            </>
                        }

                    </div>
                )
            })}
        </div>
    </div>
}