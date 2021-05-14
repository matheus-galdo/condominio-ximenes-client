import { useEffect, useState } from 'react';
import { Redirect, useHistory, useParams } from 'react-router';
import BackBtn from '../../../components/BackBtn/BackBtn';
import usePermissao from '../../../Hooks/usePermissao';
import FormInput from '../../../libs/FormInput/FormInput';
import api from '../../../Service/api';
import './Cadastro.scss';

export default function Cadastro(props) {

    const [name, setName] = useState({ valid: false, errorMessage: "", value: "" })
    const [email, setEmail] = useState({ valid: false, errorMessage: "", value: "" })
    const [password, setPassword] = useState({ valid: false, errorMessage: "", value: "" })
    const [passwordConfirmation, setPasswordConfirmation] = useState({ valid: false, errorMessage: "", value: "" })
    const [userType, setUserType] = useState({ valid: false, errorMessage: "", value: "" })
    const [apartamento, setApartamento] = useState({ valid: false, errorMessage: "", value: "" })
    const [celular, setCelular] = useState({ valid: false, errorMessage: "", value: "" })




    const [apartamentos, setApartamentos] = useState([])
    const [hasRequestedAps, setHasRequestedAps] = useState(false)

    const [userTypes, setUserTypes] = useState([])
    const [hasRequestedTypes, setHasRequestedTypes] = useState(false)


    const [stepTrigered, setStepTrigered] = useState(0)
    const [hasLoaded, setHasLoaded] = useState(false)


    const history = useHistory();
    const { permissao } = usePermissao('proprietarios')
    let { id } = useParams();


    useEffect(() => {
        let mounted = true
        if (userTypes.length === 0 && !hasRequestedTypes) {
            api().get(`listar-permissoes-user`).then(response => {
                if (mounted) {
                    setUserTypes(response.data)
                    setHasRequestedTypes(true)
                }
            })
        }
        return () => mounted = false
    }, [userTypes, hasRequestedTypes])


    useEffect(() => {
        let mounted = true

        if (apartamentos.length === 0 && !hasRequestedAps) {
            api().get('apartamentos').then(response => {
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


    useEffect(() => {
        let mounted = true
        if (id && !hasLoaded) {
            api().get(`proprietarios/${id}`).then(response => {
                if (mounted) {
                    setHasLoaded(true)
                    setName({ valid: false, errorMessage: "", value: response.data.name })
                    setEmail({ valid: false, errorMessage: "", value: response.data.email })
                    setPassword({ valid: false, errorMessage: "", value: "" })
                    setUserType({ valid: false, errorMessage: "", value: response.data.type })
                    setCelular({ valid: false, errorMessage: "", value: response.data.proprietario.telefone })
                    setApartamento({ valid: false, errorMessage: "", value: response.data.proprietario.apartamentos.map(ap => ap.id) })
                    setStepTrigered(stepTrigered + 1)
                }
            })
        }
        return () => mounted = false
    }, [stepTrigered, hasLoaded, id])


    function debugAction(value) {
        console.log('alo', value);
        setUserType(value)
    }

    function submit(e) {
        e.preventDefault()
        setStepTrigered(stepTrigered + 1)

        let fields = { name, email, userType, apartamento, celular }

        if (!id) {
            fields.password = password
            fields.password_confirmation = passwordConfirmation
        }

        let formData = {}

        let valid = true
        Object.keys(fields).forEach(fieldName => {
            if (!fields[fieldName].valid) valid = false
            formData[fieldName] = fields[fieldName].value
        })

        console.log(valid, formData, fields);

        if (valid) {
            setStepTrigered(0)


            if (id) {
                api().patch(`proprietarios/${id}`, formData).then(response => history.push('/proprietarios'))
            } else {
                api().post('proprietarios', formData).then(response => history.push('/proprietarios'))
            }
        }
    }


    return <div className='form-wrapper'>

        {permissao.modulo && (!permissao.acessar || !permissao.criar) && <Redirect to='/nao-permitido' />}
        {permissao.modulo && id && (!permissao.acessar || !permissao.editar) && <Redirect to='/nao-permitido' />}

        <BackBtn to='/proprietarios' />
        <h1>{typeof id === 'undefined' ? 'Cadastrar novo proprietário' : 'Editar proprietário'}</h1>
        <p>Defina as informações do proprietário</p>
        <form>
            <FormInput
                type='text'
                name='Nome'
                validation='required'
                defaultValue={name}
                setValue={setName}
                trigger={stepTrigered}
            />

            <FormInput
                type='email'
                name='E-mail'
                validation={['required', 'email']}
                defaultValue={email}
                setValue={setEmail}
                trigger={stepTrigered}
            />



            {typeof id === 'undefined' && <div className='form-row'>

                <FormInput
                    type='password'
                    name='Senha'
                    validation='required'
                    defaultValue={password}
                    setValue={setPassword}
                    trigger={stepTrigered}
                />

                <FormInput
                    type='password'
                    name='Confirmar senha'
                    validation={`required|confirmed:${password.value}`}
                    defaultValue={passwordConfirmation}
                    setValue={setPasswordConfirmation}
                    trigger={stepTrigered}
                />

            </div>}

            <FormInput
                type='reactSelect'
                name='Tipo de permissão'
                selectConfig={{ options: userTypes, valueKey: 'id', labelKey: 'nome' }}
                validation='required'
                defaultValue={userType}
                setValue={debugAction}
                trigger={stepTrigered}
            />

            <FormInput
                type='reactMultiSelect'
                name='Apartamentos'
                selectConfig={{ options: apartamentos }}
                validation='required'
                defaultValue={apartamento}
                setValue={setApartamento}
                trigger={stepTrigered}
            />

            <FormInput
                name='Celular'
                type='tel'
                setValue={setCelular}
                placeholder='Ex: 00 00000-0000'
                validation={'telefone'}
                defaultValue={celular}
                trigger={stepTrigered}
            />



            <div className='form-controls'>
                <button className='btn-secondary' onClick={() => history.push('/proprietarios')}>Cancelar</button>
                <button className='btn-primary' onClick={submit}>Concluir</button>
            </div>
        </form>
    </div>
}