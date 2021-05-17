import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../Context/UserProvider';
import api from '../../Service/api';
import Chat from './Chat/Chat';
import './ChatSindica.scss';
import DetalhesContato from './DetalhesContato/DetalhesContato';
import ListaContatos from './ListaContatos/ListaContatos';

export default function ChatSindica(props) {


    const [contatos, setContatos] = useState([])
    const [chats, setChats] = useState([])
    const [activeContato, setActiveContato] = useState(null)
    const [hasLoaded, setHasLoaded] = useState(false)

    const { user } = useContext(UserContext)


    console.log(user);
    useEffect(() => {
        let mounted = true

        if (!hasLoaded) {
            api().get('chat-sindica').then(response => {
                if (mounted) {
                    setHasLoaded(true)
                    setContatos(response.data)
                }
            });
        }

        return () => mounted = false
    }, [])


    // useEffect(() => {
    //     let mounted = true

    //     api().get('contatos-chat-sindica').then(response => {
    //         if (mounted) {
    //             setHasLoaded(true)
    //             setChats(response.data)
    //         }
    //     });

    //     return () => mounted = false
    // }, [])

    function openChat(e, contato) {
        e.preventDefault()
        setActiveContato(contato)
    }

    return <div className='chat-container'>
        <ListaContatos contatos={contatos} chats={chats} openChat={openChat}/>
        <Chat contato={activeContato} user={user}/>
        {/* <DetalhesContato contato={activeContato}/> */}
    </div>
}