import { useEffect, useState } from 'react';
import { Redirect, useHistory, useParams } from 'react-router';
import BackBtn from '../../../components/BackBtn/BackBtn';
import usePermissao from '../../../Hooks/usePermissao';
import FormInput from '../../../libs/FormInput/FormInput';
import api from '../../../Service/api';

export default function Cadastro(props) {

    const [despesa, setDespesa] = useState({ valid: false, errorMessage: "", value: "" })
    const [arquivos, setArquivos] = useState({ valid: false, errorMessage: "", value: {} })
    const [apartamento, setApartamento] = useState({ valid: false, errorMessage: "", value: "" })
    
    const [stepTrigered, setStepTrigered] = useState(0)
    
    const [apartamentos, setApartamentos] = useState([])
    const [hasRequestedAps, setHasRequestedAps] = useState(false)

    const [hasLoaded, setHasLoaded] = useState(false)

    

    const history = useHistory();
    const { permissao } = usePermissao('boletos')
    let { id } = useParams();

    useEffect(() => {
        let mounted = true

        if (id && !hasLoaded) {
            api().get(`boletos/${id}`).then(response => {

                if (mounted) {
                    setHasLoaded(true)
                    setDespesa({ valid: false, errorMessage: "", value: response.data.nome })
                    setApartamento({ valid: false, errorMessage: "", value: response.data.apartamento.id })
                    
                    setStepTrigered(stepTrigered + 1)
                }
            })
        }

        return () => {
            mounted = false
        }
    }, [stepTrigered, hasLoaded, id])

    useEffect(() => {
        let mounted = true

        if (apartamentos.length === 0 && !hasRequestedAps) {
            api().get('apartamentos?proprietarios=true').then(response => {
                if (mounted) {
                    setApartamentos(response.data.map(apartamento => {
                        return { value: apartamento.id, label: `${apartamento.numero} ${apartamento.bloco} - ${apartamento.andar}° andar` }
                    }))
                    setHasRequestedAps(true)
                }
            })
        }

        return () => mounted = false
    }, [apartamentos, hasRequestedAps])


    function submit(e) {
        e.preventDefault()
        setStepTrigered(stepTrigered + 1)

        let fields = { arquivos, despesa, apartamento }
        let valid = true
        let formData = {}


        if (id) {
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


        if (valid) {
            setStepTrigered(0)

            if (id) {
                api().patch(`boletos/${id}`, formData).then(response => history.push('/boletos'))
            } else {
                api().post('boletos', formData).then(response => history.push('/boletos'))
            }
        }
    }

    return <div className='form-wrapper'>

        {permissao.modulo && (!permissao.acessar || !permissao.criar) && <Redirect to='/nao-permitido' />}
        {permissao.modulo && id && (!permissao.acessar || !permissao.editar) && <Redirect to='/nao-permitido' />}

        <BackBtn/>
        <h1>{typeof id === 'undefined' ? 'Cadastrar novo boleto' : 'Editar boleto'}</h1>
        <p>Adicione um arquivo PDF a um apartamento para que seu proprietário tenha acesso.</p>
        <form>

            <FormInput
                type='text'
                name='Nome do arquivo'
                validation='required|min:3'
                defaultValue={despesa}
                setValue={setDespesa}
                trigger={stepTrigered}
            />

            {!id && <FormInput
                type='dropzone'
                name='Arquivo'
                validation='required'
                accept='application/pdf'
                defaultValue={arquivos}
                setValue={setArquivos}
                trigger={stepTrigered}
                noLabel
            />}

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
                <button className='btn-secondary' onClick={() => history.push('/boletos')}>Cancelar</button>
                <button className='btn-primary' onClick={submit}>Concluir</button>
            </div>
        </form>
    </div>
}