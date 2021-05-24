import { useEffect, useState } from 'react';
import { Redirect, useHistory, useParams } from 'react-router';
import BackBtn from '../../../components/BackBtn/BackBtn';
import FormInput from '../../../libs/FormInput/FormInput';
import api from '../../../Service/api';
import './Cadastro.scss';
import mimeTypes from '../../../assets/Helpers/mimeTypes.json'
import usePermissao from '../../../Hooks/usePermissao';

export default function Cadastro(props) {

    const [assunto, setAssunto] = useState({ valid: false, errorMessage: "", value: "" })
    const [descricao, setDescricao] = useState({ valid: false, errorMessage: "", value: "" })
    const [stepTrigered, setStepTrigered] = useState(0)
    const [arquivos, setArquivos] = useState({ valid: true, errorMessage: "", value: {} })

    const [apartamento, setApartamento] = useState({ valid: false, errorMessage: "", value: '' })
    const [apartamentos, setApartamentos] = useState([])
    const [hasRequestedAps, setHasRequestedAps] = useState(false)
    
    const [hasPosted, setHasPosted] = useState(false)

    const history = useHistory();
    const { permissao } = usePermissao('ocorrencias')
    
    useEffect(() => {
        let mounted = true

        if (!hasRequestedAps) {
            api().get('listar-apartamentos?proprietarios=true').then(response => {
                if (mounted) {
                    setHasRequestedAps(true)
                    setApartamentos(response.data.map(apartamento => {
                        return { value: apartamento.id, label: `${apartamento.numero} ${apartamento.bloco} - ${apartamento.andar}° andar` }
                    }))
                }
            })
        }

        return () => mounted = false
    }, [hasRequestedAps])

    function submit(e) {
        e.preventDefault()
        setStepTrigered(stepTrigered + 1)

        let fields = { assunto, descricao, arquivos, apartamento }
        let valid = true
        let formData = {}

        console.log(fields);

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
        


        console.log(formData);

        if (valid && !hasPosted) {
            setHasPosted(true)
            setStepTrigered(0)

            let httpVerb = 'post'
            let route = 'ocorrencias'

            api()[httpVerb](route, formData).then(response => history.push('/ocorrencias'))
            .catch(error => setHasPosted(false))
        }
    }


    
    return <div className='form-wrapper'>
        <BackBtn />
        {permissao.modulo && !permissao.criar && <Redirect to='/nao-permitido' />}

        <h1>Dados do locatário</h1>
        <p>Informe os dados do locatário para que a portaria possa liberar o seu acesso</p>
        <form>
            <FormInput
                type='text'
                name='Assunto'
                validation='required'
                defaultValue={assunto}
                setValue={setAssunto}
                trigger={stepTrigered}
            />

            <FormInput
                type='textarea'
                name='Descreva a ocorrência'
                validation='required'
                defaultValue={descricao}
                setValue={setDescricao}
                trigger={stepTrigered}
            />

            <FormInput
                type='dropzone'
                name='Anexos'
                multiple
                accept={`video/*, audio/*, image/*, ${mimeTypes.pdf}, ${mimeTypes.xls}, ${mimeTypes.xlsx}, ${mimeTypes.doc}, ${mimeTypes.docx}`}
                defaultValue={arquivos}
                optional
                showOptional
                setValue={setArquivos}
                trigger={stepTrigered}
            />

            <FormInput
                type='reactSelect'
                name='Apartamentos'
                selectConfig={{ options: apartamentos }}
                validation={'required'}
                defaultValue={apartamento}
                setValue={setApartamento}
                trigger={stepTrigered}
            />


            <div className='form-controls'>
                <button className='btn-secondary' onClick={() => history.push('/ocorrencias')}>Cancelar</button>
                <button className='btn-primary' onClick={submit}>Concluir</button>
            </div>
        </form>
    </div>
}