import { useEffect, useState } from 'react';
import { Redirect, useHistory, useParams } from 'react-router';
import BackBtn from '../../../components/BackBtn/BackBtn';
import usePermissao from '../../../Hooks/usePermissao';
import FormInput from '../../../libs/FormInput/FormInput';
import api from '../../../Service/api';

export default function Cadastro(props) {

    const [numero, setNumero] = useState({ valid: false, errorMessage: "", value: "" })
    const [bloco, setBloco] = useState({ valid: false, errorMessage: "", value: "" })
    const [andar, setAndar] = useState({ valid: false, errorMessage: "", value: "" })
    const [stepTrigered, setStepTrigered] = useState(0)
    const [hasLoaded, setHasLoaded] = useState(false)


    const history = useHistory();
    const { permissao } = usePermissao('apartamentos')
    let { id } = useParams();

    console.log(numero);
    useEffect(() => {
        let mounted = true
        if (id && !hasLoaded) {
            api().get(`apartamentos/${id}`).then(response => {
                if (mounted) {
                    setNumero({ valid: false, errorMessage: "", value: response.data.numero })
                    setBloco({ valid: false, errorMessage: "", value: response.data.bloco })
                    setAndar({ valid: false, errorMessage: "", value: response.data.andar })
                    
                    setStepTrigered(stepTrigered + 1)
                    setHasLoaded(true)
                }
            })
        }
        return () => mounted = false
    }, [stepTrigered, hasLoaded, id])


    function submit(e) {
        e.preventDefault()
        setStepTrigered(stepTrigered + 1)

        let fields = { numero, bloco, andar }
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
                api().patch(`apartamentos/${id}`, formData).then(response => history.push('/apartamentos'))
            } else {
                api().post('apartamentos', formData).then(response => history.push('/apartamentos'))
            }
        }
    }

    return <div className='form-wrapper'>

        {permissao.modulo && (!permissao.acessar || !permissao.criar) && <Redirect to='/nao-permitido' />}
        {permissao.modulo && id && (!permissao.acessar || !permissao.editar) && <Redirect to='/nao-permitido' />}

        <BackBtn to='/apartamentos' />
        <h1>{typeof id === 'undefined' ? 'Cadastrar novo apartamento' : 'Editar apartamento'}</h1>
        <p>Defina as informações do apartamento</p>
        <form>
            <FormInput
                type='text'
                name='Número'
                validation='required|number'
                defaultValue={numero}
                setValue={setNumero}
                trigger={stepTrigered}
            />

            <div className='form-row'>

                <FormInput
                    type='text'
                    name='Bloco'
                    validation='required'
                    defaultValue={bloco}
                    setValue={setBloco}
                    trigger={stepTrigered}
                />

                <FormInput
                    type='text'
                    name='Andar'
                    validation='required'
                    defaultValue={andar}
                    setValue={setAndar}
                    trigger={stepTrigered}
                />
            </div>
            <div className='form-controls'>
                <button className='btn-secondary' onClick={() => history.push('/apartamentos')}>Cancelar</button>
                <button className='btn-primary' onClick={submit}>Concluir</button>
            </div>
        </form>
    </div>
}