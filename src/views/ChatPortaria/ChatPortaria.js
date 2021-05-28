import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../Context/UserProvider';
import usePermissao from '../../Hooks/usePermissao';
import api from '../../Service/api';
import Chat from './Chat/Chat';
import DetalhesContato from './DetalhesContato/DetalhesContato';
import ListaContatos from './ListaContatos/ListaContatos';
import './ChatPortaria.scss';

export default function ChatPortaria(props) {


    const [contatos, setContatos] = useState([])
    const [activeContato, setActiveContato] = useState(null)
    const [hasLoaded, setHasLoaded] = useState(false)

    const [showContatos, setShowContatos] = useState(true)
    const [showDetails, setShowDetails] = useState(false)


    const { user } = useContext(UserContext)
    const { permissao } = usePermissao('chat-portaria')

    useEffect(() => {
        let mounted = true

        if (!hasLoaded) {
            api().get('chat-portaria').then(response => {
                if (mounted) {
                    setHasLoaded(true)
                    setContatos(response.data)
                }
            });
        }

        return () => mounted = false
    }, [hasLoaded])


    function updateContato() {
        setHasLoaded(false)
    }


    function openChat(e, contato) {
        e.preventDefault()
        setShowContatos(false)
        setActiveContato(contato)
    }

    return <div className='chat-container'>
        <ListaContatos showContatos={showContatos} contatos={contatos} openChat={openChat} updateContato={updateContato} />
        <Chat
            contato={activeContato}
            user={user}
            updateContato={updateContato}
            setShowContatos={setShowContatos}
            setShowDetails={setShowDetails}
            permissao={permissao}
        />
        {permissao.gerenciar && <DetalhesContato contato={activeContato} showDetails={showDetails} setShowDetails={setShowDetails}/>}
    </div>
}