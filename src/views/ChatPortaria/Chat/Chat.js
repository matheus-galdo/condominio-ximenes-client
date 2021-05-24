import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../Service/api';
import moment from 'moment';
import imgMessage from '../../.././/assets/img/mail-notification-2557119-2139454.png'
import './Chat.scss'
import ReactTooltip from 'react-tooltip';

import { IoMdSend } from 'react-icons/io';
import { AiOutlineDownload } from 'react-icons/ai';
import { FiPaperclip } from "react-icons/fi";
import { GrClose } from "react-icons/gr";

import { bytesToSize, dateFormater } from '../../../assets/Helpers/helpers';
import FormInput from '../../../libs/FormInput/FormInput';


function downloadFile(e, mensagem) {
    e.preventDefault()
    api(false, 'blob').get(`download-file?file=${mensagem.id}&module=mensagem-portaria`).then(response => {
        console.log(response);

        let filename = 'file.txt'
        try {
            filename = response.headers['content-disposition'].split(';')[1].split('=')[1]
        } catch (error) {

        }

        let url = URL.createObjectURL(new Blob([response.data]));
        let a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url)
    })
}

export default function Chat(props) {

    const [mensagens, setMensagens] = useState([])

    const [mensagem, setMensagen] = useState("")

    const [anexosModal, setAnexosModal] = useState(false)
    const [arquivos, setArquivos] = useState({ valid: false, errorMessage: "", value: {} })
    const [stepTrigered, setStepTrigered] = useState(0)




    useEffect(() => {
        let mounted = true
        setMensagens([])
        if (props.contato && props.contato.chat) {
            api().get(`chat-portaria/${props.contato.chat.id}`).then(response => {
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

    function showAnexos(e) {
        e.preventDefault()
        setAnexosModal(true)
    }

    function hideAnexos(e) {
        e.preventDefault()
        setAnexosModal(false)
    }

    function sendMessage(e) {
        e.preventDefault()

        let data = { mensagem }

        if (props.user.typeName.is_admin) {
            data.proprietario = props.contato.proprietario_id
        }

        setMensagen("")
        api().post(`chat-portaria-mensagens`, data).then(response => {
            setMensagens(response.data)
        });
    }

    function sendAnexo(e) {
        e.preventDefault()

        let formData = new FormData();

        formData.append(`message`, "")

        console.log(arquivos);

        if (!arquivos.valid) {
            setArquivos({ valid: false, errorMessage: "Adicione um arquivo para enviar", value: {} })
            return
        }

        if ('acceptedFiles' in arquivos.value) {
            arquivos.value.acceptedFiles.map(file => formData.append(`arquivos[]`, file))
        }

        if (props.user.typeName.is_admin) {
            formData.append(`proprietario`, props.contato.proprietario_id)
        }

        setMensagen("")
        setArquivos({ valid: false, errorMessage: "", value: {} })

        api().post(`chat-portaria-mensagens`, formData).then(response => {
            setMensagens(response.data)
            hideAnexos(e)
            setStepTrigered(0)
        });
    }

    console.log(arquivos);
    function getMessageCardClass(mensagem) {
        return (mensagem.mensagem_admin && props.user.typeName.is_admin) || (!mensagem.mensagem_admin && !props.user.typeName.is_admin) ? ' my-message' : ''
    }

    function renderMessageContent(mensagem) {

        let content = mensagem.mensagem

        if (mensagem.anexo) {
            content = <div className='message-card__anexos'>
                <div className='anexo-card'>
                    <div className='details' onClick={e => downloadFile(e, mensagem)}>
                        <AiOutlineDownload />
                        <p>{bytesToSize(50000)}</p>
                    </div>
                    <div className={'file-icon'}>{mensagem.extensao}</div>
                    <p>{mensagem.nome_original}</p>
                </div>
            </div>
        }

        return content
    }

    console.log(props.contato);
    return <section className='chat-messages-container'>

        <div className={'modal-chat' + (anexosModal ? ' active' : '')}>
            <div className='modal-container'>
                <div className='button-container'>
                    <button className='close-btn' onClick={hideAnexos}><GrClose /></button>
                </div>
                <div className='dropzone-container'>
                    <FormInput
                        type='dropzone'
                        name='Anexos'
                        validation='required'
                        defaultValue={arquivos}
                        setValue={setArquivos}
                        trigger={stepTrigered}
                    />
                </div>
                <div className='modal-controls'>
                    <button className='btn-primary' onClick={sendAnexo}>Enviar</button>
                </div>
            </div>
        </div>

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
                                {renderMessageContent(mensagem)}
                                {/* {mensagem.mensagem} */}

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
            <button className='anexo-btn' onClick={showAnexos}><FiPaperclip /></button>
            <button className='submit-btn' onClick={sendMessage}><IoMdSend /></button>
        </div>}
    </section>
}