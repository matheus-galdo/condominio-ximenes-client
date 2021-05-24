import { useEffect, useState } from 'react';
import { Redirect, useHistory, useParams } from 'react-router';
import BackBtn from '../../../components/BackBtn/BackBtn';
import usePermissao from '../../../Hooks/usePermissao';
import FormInput from '../../../libs/FormInput/FormInput';
import api from '../../../Service/api';

export default function Cadastro(props) {

    const [titulo, setTitulo] = useState({ valid: false, errorMessage: "", value: "" })
    const [descricao, setDescricao] = useState({ valid: false, errorMessage: "", value: "" })
    const [dataExpiracao, setDataExpiracao] = useState({ valid: true, errorMessage: "", value: "" })
    const [stepTrigered, setStepTrigered] = useState(0)
    const [hasLoaded, setHasLoaded] = useState(false)
    const [hasSubmited, setHasSubmited] = useState(false)

    const { permissao } = usePermissao('avisos')

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

        if(valid && !hasSubmited){
            setStepTrigered(0)
            setHasSubmited(true)

            let httpVerb = id? 'patch' : 'post'
            let route = id? `avisos/${id}` : 'avisos'

            api()[httpVerb](route, formData).then(response => history.push('/avisos'))
            .catch(error => setHasSubmited(false))
        }
    }

    return <div className='form-wrapper'>
        {permissao.modulo && (!permissao.acessar || !permissao.criar) && <Redirect to='/nao-permitido' />}
        {permissao.modulo && id && (!permissao.acessar || !permissao.editar) && <Redirect to='/nao-permitido' />}

        <BackBtn/>
        <h1>{typeof id === 'undefined' ? 'Cadastrar novo aviso' : 'Editar aviso'}</h1>
        <p>Adicione um aviso para os proprietários.</p>

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