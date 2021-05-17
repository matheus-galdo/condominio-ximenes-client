import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import api from "../../../Service/api";
import './Register.scss';
import FormInput from "../../../libs/FormInput/FormInput";
import BackBtn from "../../../components/BackBtn/BackBtn";



export default function Register(props) {


    const history = useHistory();


    useEffect(() => {
        document.title = "Login"
    }, []);



    const [name, setName] = useState({ valid: false, errorMessage: "", value: "" })
    const [email, setEmail] = useState({ valid: false, errorMessage: "", value: "" })
    const [password, setPassword] = useState({ valid: false, errorMessage: "", value: "" })
    const [passwordConfirmation, setPasswordConfirmation] = useState({ valid: false, errorMessage: "", value: "" })
    const [apartamento, setApartamento] = useState({ valid: false, errorMessage: "", value: "" })
    const [celular, setCelular] = useState({ valid: true, errorMessage: "", value: "" })

    const [stepTrigered, setStepTrigered] = useState(0)



    function submit(e) {
        e.preventDefault()
        setStepTrigered(stepTrigered + 1)

        let fields = { name, email, apartamento, celular, password, password_confirmation: passwordConfirmation }

        let formData = {}

        let valid = true
        Object.keys(fields).forEach(fieldName => {
            if (!fields[fieldName].valid) valid = false
            formData[fieldName] = fields[fieldName].value
        })

        console.log(valid, formData, fields);

        if (valid) {
            setStepTrigered(0)

            api().post('novo-proprietario', formData).then(response => history.push('/login'))
        }

    }



    return <div className="app-main-container">
        <div className='app-wrapper'>

            <div className={"content-wrapper"}>

                <div className='form-wrapper'>

                    <BackBtn to='/login' />
                    <h1>Crie sua novo conta</h1>
                    <p>Defina as informações de login e dados pessoais</p>
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



                        <div className='form-row'>
                            <FormInput
                                type='password'
                                name='Senha'
                                validation='required|min:8'
                                defaultValue={password}
                                setValue={setPassword}
                                trigger={stepTrigered}
                                col={6}
                            />

                            <FormInput
                                type='password'
                                name='Confirmar senha'
                                validation={`required|confirmed:${password.value}|min:8`}
                                defaultValue={passwordConfirmation}
                                setValue={setPasswordConfirmation}
                                trigger={stepTrigered}
                                col={6}
                            />

                        </div>

                        <FormInput
                            name='Apartamento'
                            type='text'
                            setValue={setApartamento}
                            validation='required'
                            tooltip={'Informe o número do seu apartamento'}
                            defaultValue={apartamento}
                            trigger={stepTrigered}
                        />

                        <FormInput
                            name='Celular'
                            type='tel'
                            setValue={setCelular}
                            placeholder='Ex: 00 00000-0000'
                            validation={'required|telefone'}
                            defaultValue={celular}
                            trigger={stepTrigered}
                        />



                        <div className='form-controls'>
                            <button className='btn-secondary' onClick={() => history.push('/login')}>Cancelar</button>
                            <button className='btn-primary' onClick={submit}>Concluir</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
}