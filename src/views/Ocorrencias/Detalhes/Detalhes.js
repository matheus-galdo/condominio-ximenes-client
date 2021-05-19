import moment from 'moment';
import { useEffect, useState } from 'react';
import { Redirect, useHistory, useParams } from 'react-router';
import { bytesToSize, dateFormater } from '../../../assets/Helpers/helpers';
import { FiPaperclip } from "react-icons/fi";
import { CgAddR } from "react-icons/cg";
import { AiOutlineDownload } from "react-icons/ai";
import BackBtn from '../../../components/BackBtn/BackBtn';
import usePermissao from '../../../Hooks/usePermissao';
import api from '../../../Service/api';
import './Detalhes.scss';
import { Link } from 'react-router-dom';
import OptionsBtn from '../../../components/OptionsBtn/OptionsBtn';


function downloadFile(e, file) {
    e.preventDefault()
    api(false, 'blob').get(`download-file?file=${file.id}&module=ocorrencia`).then(response => {
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


export default function Detalhes(props) {

    const [ocorrencia, setOcorrencia] = useState(null)
    const [hasLoaded, setHasLoaded] = useState(false)

    let { id } = useParams();
    const { permissao } = usePermissao('ocorrencias')
    const history = useHistory();


    useEffect(() => {
        let mounted = true

        if (id && !hasLoaded) {
            api().get(`ocorrencias/${id}`).then(response => {
                if (mounted) {
                    setHasLoaded(true)
                    setOcorrencia(response.data)
                }
            })
        }

        return () => mounted = false
    }, [hasLoaded])



    function getItenOptions(item, moduloName, reload) {

        let options = []

        if (item.deleted_at) options.push({ name: 'Ativar', f: () => api().put(`${moduloName}/${item.id}`, { ativar: true }).then(response => reload(false)) })
        if (!item.deleted_at) options.push({ name: 'Desativar', f: () => api().put(`${moduloName}/${item.id}`, { ativar: false }).then(response => reload(false)) })

        if (permissao.editar) options.push({ name: 'Editar', f: () => history.push(`/ocorrencias-followup/${id}/${item.id}`) })
        if (permissao.excluir && item.deleted_at) options.push({ name: 'Excluir', f: () => api().delete(`${moduloName}/${item.id}`).then(response => reload(false)) })

        return options
    }


    return <div className='details-wrapper'>
        {permissao.modulo && (!permissao.acessar || !permissao.visualizar) && <Redirect to='/nao-permitido' />}

        <BackBtn />

        {ocorrencia && <>

            <h1>{ocorrencia.assunto} </h1>
            <p><span className='bold'>Criado por: </span> {ocorrencia.autor.name} - {ocorrencia.autor.type_name.nome}</p>
            <p><span className='bold'>Publicado em: </span> {moment(ocorrencia.updated_at).format('L')}</p>
            {ocorrencia.deleted_at && <p><span className='bold'>Desativado em: </span> {moment(ocorrencia.deleted_at).format('L')}</p>}

            <h3>Apartamentos</h3>
            <div className='square-list'>
                {permissao.gerenciar ? <div className='square-list__item-clickable'>
                    <Link className='square-list__item-content' to={`/apartamentos/${ocorrencia.apartamento.id}`}>
                        <span className='square-list__number-block'>{1}</span>
                        <p>
                            Apartamento {ocorrencia.apartamento.numero}<br />
                            <span>Bloco: {ocorrencia.apartamento.bloco}</span><br />
                            <span>{ocorrencia.apartamento.andar}° andar</span>
                        </p>

                    </Link>
                    <Link to={`/apartamentos/${ocorrencia.apartamento.id}`} className='square-list__item-details-button'>
                        Ver apartamento
                    </Link>
                </div>
                    :
                    <div className='square-list__item'>
                        <div className='square-list__item-content'>
                            <span className='square-list__number-block'>{1}</span>
                            <p>
                                Apartamento {ocorrencia.apartamento.numero}<br />
                                <span>Bloco: {ocorrencia.apartamento.bloco}</span><br />
                                <span>{ocorrencia.apartamento.andar}° andar</span>
                            </p>
                        </div>
                    </div>
                }
            </div>


            <h3 className='followup-title'>Acompanhamento
                {permissao.gerenciar && <Link className='add-status-btn' to={`/ocorrencias-followup/${id}`}><CgAddR /> Adicionar follow-up</Link>}
            </h3>
            <section className='followup-container'>

                {ocorrencia.followup.map((followup, key) => {
                    let options = getItenOptions(followup, 'ocorrencias-followup', setHasLoaded)

                    return <article key={key} className={'followup-card'}>
                        <header className='followup-card__header'>
                            <div className='followup-card__header-wrapper'>
                                <h1 className={'followup-card__title' + (followup.deleted_at ? ' disabled' : '')} >
                                    <span className={'followup-card__status-icon' + (followup.deleted_at ? ' disabled' : '')} style={{ borderColor: !followup.deleted_at ? followup.evento.cor : '#c2c2c2'}}></span>
                                    {followup.evento.nome} {followup.deleted_at && ' - desabilitado'}
                                </h1>
                                <p title={moment(followup.updated_at).format('LLL')} className={'followup-card__time' + (followup.deleted_at ? ' disabled' : '')}>
                                    {dateFormater(followup.updated_at)}
                                </p>
                            </div>

                            {permissao.gerenciar && <OptionsBtn options={options} />}

                        </header>
                        
                        <main className={'followup-card__content' + (followup.deleted_at ? ' disabled' : '')}>
                            {followup.descricao}
                        </main>
                        {followup.anexos.length > 0 && <footer className='followup-card__anexos-container'>
                            <h1><FiPaperclip /> Anexos</h1>
                            <div className='followup-card__anexos'>
                                {followup.anexos.map((anexo, key) => <div key={key} className='anexo-card'>
                                    <div className='details' onClick={e => downloadFile(e, anexo)}>
                                        <AiOutlineDownload />
                                        <p>{bytesToSize(50000)}</p>
                                    </div>
                                    <div className={'file-icon' + (followup.deleted_at ? ' disabled' : '')} >{anexo.extensao}</div>
                                    <p>{anexo.nome_original}</p>
                                </div>)}
                            </div>
                        </footer>}
                    </article>
                })}
            </section>
        </>}

    </div>
}