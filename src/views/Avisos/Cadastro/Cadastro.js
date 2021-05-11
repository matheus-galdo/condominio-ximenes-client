import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import FormInput from '../../../libs/FormInput';
import api from '../../../Service/api';
import './Cadastro.scss';

export default function Cadastro(props) {

    const [titulo, setTitulo] = useState({ valid: false, errorMessage: "", value: "" })
    const [descricao, setDescricao] = useState({ valid: false, errorMessage: "", value: "" })
    const [dataExpiracao, setDataExpiracao] = useState({ valid: false, errorMessage: "", value: "" })
    const [stepTrigered, setStepTrigered] = useState(0)
    const [hasLoaded, setHasLoaded] = useState(false)


    const history = useHistory();
    let { id } = useParams();

    useEffect(() => {

        if(id && !hasLoaded){
            api().get(`avisos/${id}`).then(response => {

                setTitulo({ valid: false, errorMessage: "", value: response.data.titulo })
                setDescricao({ valid: false, errorMessage: "", value: response.data.descricao })
                setDataExpiracao({ valid: false, errorMessage: "", value: response.data.data_expiracao })

                setStepTrigered(stepTrigered + 1)
                setHasLoaded(true)
            })
        }
    }, [stepTrigered, hasLoaded, id])
    

    function submit(e) {
        console.log(stepTrigered);
        e.preventDefault()
        setStepTrigered(stepTrigered + 1)


        let fields = {titulo, descricao, dataExpiracao}
        let formData = {}

        let valid = true
        Object.keys(fields).forEach(fieldName => {
            if (!fields[fieldName].valid) valid = false
            formData[fieldName] = fields[fieldName].value
        })

        console.log(valid, formData, fields);

        if(valid){
            setStepTrigered(0)

            api().post('avisos', formData).then(response => console.log(response.data))
        }
    }

    return <div>
        <form>
            <FormInput
                type='text'
                name='Titulo'
                validation='required'
                defaultValue={titulo}
                setValue={setTitulo}
                trigger={stepTrigered}
            />

            <FormInput
                type='textarea'
                name='Descrição'
                validation='required'
                defaultValue={descricao}
                setValue={setDescricao}
                trigger={stepTrigered}
            />

            <FormInput
                type='date'
                name='Expira em'
                optional
                showOptional
                defaultValue={dataExpiracao}
                setValue={setDataExpiracao}
                trigger={stepTrigered}
            />

            <div className='form-controls'>
                <button className='btn-secondary' onClick={() => history.push('/avisos')}>Cancelar</button>
                <button className='btn-primary' onClick={submit}>Concluir</button>
            </div>
        </form>
    </div>
}