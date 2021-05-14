import moment from 'moment';
import { useEffect, useState } from 'react';
import { Redirect, useHistory, useParams } from 'react-router';
import BackBtn from '../../../components/BackBtn/BackBtn';
import usePermissao from '../../../Hooks/usePermissao';
import FormInput from '../../../libs/FormInput/FormInput';
import api from '../../../Service/api';
import './Cadastro.scss';

export default function Cadastro(props) {

    const [nome_arquivo, setNomeArquivo] = useState({ valid: false, errorMessage: "", value: "" })
    const [publico, setPublico] = useState({ valid: true, errorMessage: "", value: true })
    const [arquivos, setArquivos] = useState({ valid: false, errorMessage: "", value: {} })
    const [data_expiracao, setDataExpiracao] = useState({ valid: true, errorMessage: "", value: "" })
    const [stepTrigered, setStepTrigered] = useState(0)
    const [hasLoaded, setHasLoaded] = useState(false)
    const [today] = useState(moment().format('YYYY-MM-DD'))


    const history = useHistory();
    const { permissao } = usePermissao('documentos')
    let { id } = useParams();

    useEffect(() => {
        let mounted = true

        if (id && !hasLoaded) {
            api().get(`documentos/${id}`).then(response => {

                if (mounted) {
                    setHasLoaded(true)
                    setNomeArquivo({ valid: false, errorMessage: "", value: response.data.nome })
                    setPublico({ valid: false, errorMessage: "", value: response.data.is_public })
                    setDataExpiracao({ valid: false, errorMessage: "", value: response.data.data_expiracao || "" })
                    setStepTrigered(stepTrigered + 1)
                }
            })
        }

        return () => {
            mounted = false
        }
    }, [stepTrigered, hasLoaded, id])


    function submit(e) {
        e.preventDefault()
        setStepTrigered(stepTrigered + 1)

        let fields = { publico, arquivos, data_expiracao, nome_arquivo }
        let valid = true
        let formData = {}


        if (id){
            delete fields.arquivos
        
            Object.keys(fields).forEach(fieldName => {
                if (!fields[fieldName].valid) valid = false
    
                formData[fieldName] = fields[fieldName].value
            })

        }else{
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


        console.log(formData);

        if (valid) {
            setStepTrigered(0)

            if (id) {
                api().patch(`documentos/${id}`, formData).then(response => history.push('/documentos'))
            } else {
                api().post('documentos', formData).then(response => history.push('/documentos'))
            }
        }
    }

    return <div className='form-wrapper'>

        {permissao.modulo && (!permissao.acessar || !permissao.criar) && <Redirect to='/nao-permitido' />}
        {permissao.modulo && id && (!permissao.acessar || !permissao.editar) && <Redirect to='/nao-permitido' />}

        <BackBtn to='/documentos' />
        <h1>{typeof id === 'undefined' ? 'Cadastrar novo documento' : 'Editar documento'}</h1>
        <p>Compartilhe um arquivo com os usuários do sistema</p>
        <form>

            <FormInput
                type='text'
                name='Nome do arquivo'
                validation='required|min:3'
                defaultValue={nome_arquivo}
                setValue={setNomeArquivo}
                trigger={stepTrigered}
            />

            {!id && <FormInput
                type='dropzone'
                name='Arquivo'
                validation='required'
                defaultValue={arquivos}
                setValue={setArquivos}
                trigger={stepTrigered}
                noLabel
            />}


            <FormInput
                type='date'
                name='Data de expiração'
                optional
                showOptional
                min={today}
                tooltip='A partir desta data o documento não será mais exibido para os proprietários'
                defaultValue={data_expiracao}
                setValue={setDataExpiracao}
                trigger={stepTrigered}
            />


            <FormInput
                type='checkbox'
                name='Documento disponível para todos os usuários'
                tooltip='Caso não esteja marcado, apenas usuários com permissão de administrador poderão ver este documento'
                optional
                showOptional
                defaultValue={publico}
                setValue={setPublico}
                trigger={stepTrigered}
            />


            <div className='form-controls'>
                <button className='btn-secondary' onClick={() => history.push('/documentos')}>Cancelar</button>
                <button className='btn-primary' onClick={submit}>Concluir</button>
            </div>
        </form>
    </div>
}