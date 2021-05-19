import { useEffect, useState } from 'react';
import { Redirect, useHistory, useParams } from 'react-router';
import BackBtn from '../../../components/BackBtn/BackBtn';
import FormInput from '../../../libs/FormInput/FormInput';
import api from '../../../Service/api';
import mimeTypes from '../../../assets/Helpers/mimeTypes.json'
import usePermissao from '../../../Hooks/usePermissao';

export default function Followup(props) {

    const [ocorrencia, setOcorrencia] = useState(null)
    const [eventos, setEventos] = useState(null)

    const [evento, setEvento] = useState({ valid: true, errorMessage: "", value: 2 })
    const [descricao, setDescricao] = useState({ valid: false, errorMessage: "", value: "" })
    const [arquivos, setArquivos] = useState({ valid: true, errorMessage: "", value: {} })

    const [hasRequestedEventos, setHasRequestedEventos] = useState(false)
    const [hasRequestedFollowup, setHasRequestedFollowup] = useState(false)
    const [hasLoaded, setHasLoaded] = useState(false)

    const [hasPosted, setHasPosted] = useState(false)
    const [stepTrigered, setStepTrigered] = useState(0)

    const history = useHistory();
    const { permissao } = usePermissao('ocorrencias-followup')
    let { id, idfollowup } = useParams();

    useEffect(() => {
        let mounted = true

        if (id && !hasLoaded) {
            api().get(`ocorrencias/${id}`).then(response => {
                if (mounted) {
                    setHasLoaded(true)
                    setOcorrencia(response.data)
                }
            }).catch(error => history.push('/ocorrencias'))
        }

        return () => mounted = false
    }, [hasLoaded, history, id])


    useEffect(() => {
        let mounted = true

        if (hasLoaded && ocorrencia && idfollowup && !hasRequestedFollowup) {
            if(mounted){
                setHasRequestedFollowup(true)
                let followupItem = ocorrencia.followup.filter(followupItem => {return followupItem.id === parseInt(idfollowup)})
                if (followupItem.length === 0) {
                    history.push('/ocorrencias')
                    return
                }
                setEvento({ valid: true, errorMessage: "", value: followupItem[0].evento.id })
                setDescricao({ valid: true, errorMessage: "", value: followupItem[0].descricao })
            }
        }

        return () => mounted = false
    }, [hasRequestedFollowup, hasLoaded, ocorrencia, idfollowup, history])


    useEffect(() => {
        let mounted = true

        if (!hasRequestedEventos) {
            api().get('listar-eventos-ocorrencia').then(response => {
                if (mounted) {
                    setHasRequestedEventos(true)
                    setEventos(response.data.map(evento => {
                        return { value: evento.id, label: evento.nome }
                    }))
                }
            })
        }

        return () => mounted = false
    }, [hasRequestedEventos])


    function submit(e) {
        e.preventDefault()
        setStepTrigered(stepTrigered + 1)

        let fields = { descricao, arquivos, evento }
        let valid = true
        let formData = {}


        if (idfollowup) {
            delete fields.arquivos

            Object.keys(fields).forEach(fieldName => {
                if (!fields[fieldName].valid) valid = false

                formData[fieldName] = fields[fieldName].value
            })

        } else {
            formData = new FormData();

            Object.keys(fields).forEach(fieldName => {
                if (!fields[fieldName].valid) valid = false

                if (fieldName === 'arquivos') {
                    if ('acceptedFiles' in fields[fieldName].value) {
                        fields[fieldName].value.acceptedFiles.map(file => formData.append(`${fieldName}[]`, file))
                    }
                } else {
                    formData.append(fieldName, fields[fieldName].value);
                }
            })
        }


        if (valid && !hasPosted) {
            setHasPosted(true)
            setStepTrigered(0)
            console.log('aa');

            let httpVerb = (idfollowup) ? 'patch' : 'post'

            if (idfollowup) {
                formData.ocorrencia = id;
            }else{
                formData.append('ocorrencia', id);
            }

            let route = (idfollowup)?`ocorrencias-followup/${idfollowup}`:`ocorrencias-followup`

            api()[httpVerb](route, formData).then(response => history.push('/ocorrencias'))
                .catch(error => setHasPosted(false))
        }
    }



    return <div className='form-wrapper'>
        <BackBtn />
        {permissao.modulo && (!id || (id && !permissao.gerenciar)) && <Redirect to='/nao-permitido' />}


        <h1>Follow-up da ocorrência</h1>
        <p>Informe sobre os avanços realizados na ocorrência para manter o proprietário atualizado</p>


        {eventos && ocorrencia && <form>
            <FormInput
                type='reactSelect'
                name='Evento do follow-up'
                selectConfig={{ options: eventos }}
                validation={'required'}
                defaultValue={evento}
                setValue={setEvento}
                trigger={stepTrigered}
            />


            <FormInput
                type='textarea'
                name='Descrição do evento'
                validation='required'
                defaultValue={descricao}
                setValue={setDescricao}
                trigger={stepTrigered}
            />

            {!idfollowup && <FormInput
                type='dropzone'
                name='Anexos'
                multiple
                accept={`video/*, audio/*, image/*, ${mimeTypes.pdf}, ${mimeTypes.xls}, ${mimeTypes.xlsx}, ${mimeTypes.doc}, ${mimeTypes.docx}`}
                defaultValue={arquivos}
                optional
                showOptional
                setValue={setArquivos}
                trigger={stepTrigered}
            />}




            <div className='form-controls'>
                <button className='btn-secondary' onClick={() => history.push('/ocorrencias')}>Cancelar</button>
                <button className='btn-primary' onClick={submit}>Concluir</button>
            </div>
        </form>}
    </div>
}