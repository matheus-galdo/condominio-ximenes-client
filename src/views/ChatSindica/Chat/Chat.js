import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../Service/api';
import moment from 'moment';
import { IoMdSend } from 'react-icons/io';
import imgMessage from '../../.././/assets/img/mail-notification-2557119-2139454.png'
import './Chat.scss'
import ReactTooltip from 'react-tooltip';
import { dateFormater } from '../../../assets/Helpers/helpers';

export default function Chat(props) {

    const [mensagens, setMensagens] = useState([])

    const [mensagem, setMensagen] = useState("")


    useEffect(() => {
        let mounted = true
        setMensagens([])
        if (props.contato && props.contato.chat) {
            api().get(`chat-sindica/${props.contato.chat.id}`).then(response => {
                if (mounted) {
                    setMensagens(response.data)
                }
            });
        }

        return () => mounted = false
    }, [props.contato])

    function getAuthorName(mensagem) {
        if (mensagem.mensagem_admin) {
            return props.user.typeName.is_admin ?
                <Link to={`usuarios/${mensagem.autor.user_id}`}>{mensagem.autor.name}</Link> : 'Síndica'
        }

        return props.user.typeName.is_admin ?
            <Link to={`proprietarios/${mensagem.autor.user_id}`}>{mensagem.autor.name}</Link> : mensagem.autor.name
    }

    function handleMessage(e) {
        setMensagen(e.target.value)
    }

    function handleSubmit(e) {
        if (e.key === "Enter" && !e.ctrlKey && !e.altKey && !e.shiftKey) {
            sendMessage(e)
        }
    }

    function sendMessage(e) {
        e.preventDefault()

        let data = { mensagem }

        if (props.user.typeName.is_admin) {
            data.proprietario = props.contato.proprietario_id
        }

        setMensagen("")
        api().post(`chat-sindica-mensagens`, data).then(response => {
            setMensagens(response.data)
        });
    }

    function getMessageCardClass(mensagem) {
        return (mensagem.mensagem_admin && props.user.typeName.is_admin) || (!mensagem.mensagem_admin && !props.user.typeName.is_admin) ? ' my-message' : ''
    }

    console.log(props.contato);
    return <section className='chat-messages-container'>

        <div className='chat-contato-header'>{props.contato && props.contato.name}</div>
        {!props.contato &&
            <div className='no-message'>
                <img src={imgMessage} />
                <p>Clique em um contato para enviar uma mensagem</p>
            </div>
        }

        <div className={'message-container'}>
            {props.contato && mensagens.length > 0 &&
                <>
                    {mensagens.map((mensagem, key) => <>
                        <div key={key} className={'message-card-wrapper' + getMessageCardClass(mensagem)}>

                            <div className={'message-card' + getMessageCardClass(mensagem)}>
                                {mensagem.mensagem}

                                <span className='author-message'>
                                    {getAuthorName(mensagem)} - <span title={moment(mensagem.created_at).format('LLL')}>{dateFormater(mensagem.created_at)}</span>
                                </span>
                            </div>
                        </div>
                    </>)}
                </>
            }
        </div>


        {props.contato && <div className='chat-controls'>
            <input placeholder="Enviar mensagem" type="text" value={mensagem} onChange={handleMessage} onKeyUp={handleSubmit} />
            <button className='submit-btn' onClick={sendMessage}><IoMdSend /></button>
        </div>}
    </section>
}