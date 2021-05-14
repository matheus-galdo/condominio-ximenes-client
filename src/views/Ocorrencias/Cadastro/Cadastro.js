import { useState } from 'react';
import { useHistory } from 'react-router';
import FormInput from '../../../libs/FormInput/FormInput';
import api from '../../../Service/api';
import './Cadastro.scss';

export default function Cadastro(props) {

    const [assunto, setAssunto] = useState({ valid: false, errorMessage: "", value: "" })
    const [descricao, setDescricao] = useState({ valid: false, errorMessage: "", value: "" })
    const [stepTrigered, setStepTrigered] = useState(0)

    const history = useHistory();

    function submit(e) {
        e.preventDefault()
        setStepTrigered(stepTrigered + 1)


        let fields = {assunto, descricao}
        let formData = {}

        let valid = true
        Object.keys(fields).forEach(fieldName => {
            if (!fields[fieldName].valid) valid = false
            formData[fieldName] = fields[fieldName].value
        })


        if(valid){
            api().post('ocorrencias', formData).then(response => console.log(response.data))
        }
    }

    return <div className='module-wrapper'>
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

            <div className='form-controls'>
                <button className='btn-secondary' onClick={() => history.push('/ocorrencias')}>Cancelar</button>
                <button className='btn-primary' onClick={submit}>Concluir</button>
            </div>
        </form>
    </div>
}