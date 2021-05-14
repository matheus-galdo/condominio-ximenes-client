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
    const [userType, setUserType] = useState({ valid: false, errorMessage: "", value: 1 })
    
    
    const [userTypes, setUserTypes] = useState([])
    const [stepTrigered, setStepTrigered] = useState(0)
    const [hasLoaded, setHasLoaded] = useState(false)


    const history = useHistory();
    const { permissao } = usePermissao('usuarios')
    let { id } = useParams();


    useEffect(() => {
        if (userTypes.length === 0) {
            api().get(`listar-permissoes-admin`).then(response => setUserTypes(response.data))
        }
    }, [userTypes])

    useEffect(() => {
        if (id && !hasLoaded) {
            api().get(`usuarios/${id}`).then(response => {

                setName({ valid: false, errorMessage: "", value: response.data.name })
                setEmail({ valid: false, errorMessage: "", value: response.data.email })
                setPassword({ valid: false, errorMessage: "", value: "" })
                setUserType({ valid: false, errorMessage: "", value: response.data.type })

                setStepTrigered(stepTrigered + 1)
                setHasLoaded(true)
            })
        }
    }, [stepTrigered, hasLoaded, id])


    function debugAction(value) {
        console.log('alo', value);
        setUserType(value)
    }

    function submit(e) {
        e.preventDefault()
        setStepTrigered(stepTrigered + 1)

        let fields = { name, email, userType }

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
                api().patch(`usuarios/${id}`, formData).then(response => history.push('/usuarios'))
            } else {
                api().post('usuarios', formData).then(response => history.push('/usuarios'))
            }
        }
    }

    return <div className='form-wrapper'>

        {permissao.modulo && (!permissao.acessar || !permissao.criar) && <Redirect to='/nao-permitido' />}
        {permissao.modulo && id && (!permissao.acessar || !permissao.editar) && <Redirect to='/nao-permitido' />}

        <BackBtn to='/usuarios' />
        <h1>{typeof id === 'undefined' ? 'Cadastrar novo usuário' : 'Editar usuário'}</h1>
        <p>Defina as informações do usuário</p>
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
                    type='select'
                    name='Tipo de permissão'
                    options={userTypes}
                    validation='required'
                    defaultValue={userType}
                    setValue={debugAction}
                    trigger={stepTrigered}
                />

            <div className='form-controls'>
                <button className='btn-secondary' onClick={() => history.push('/usuarios')}>Cancelar</button>
                <button className='btn-primary' onClick={submit}>Concluir</button>
            </div>
        </form>
    </div>
}