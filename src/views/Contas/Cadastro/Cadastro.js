import moment from 'moment';
import { useEffect, useState } from 'react';
import { Redirect, useHistory, useParams } from 'react-router';
import BackBtn from '../../../components/BackBtn/BackBtn';
import usePermissao from '../../../Hooks/usePermissao';
import FormInput from '../../../libs/FormInput/FormInput';
import api from '../../../Service/api';
// import FormStep from './FormStep';
// import FormSteps from './FormSteps';


// const gruposContas = [
//     { codigo: 1, nome: 'DESPESAS DE PESSOAL' },
//     { codigo: 2, nome: 'DESPESAS DE CONSERVAÇÃO / CONSUMO' },
//     { codigo: 3, nome: 'DESPESAS DE ADMINISTRAÇÃO' },
//     { codigo: 4, nome: 'RESUMO INFORMATIVO DAS RECEITAS / DESPESAS' },
//     { codigo: 5, nome: 'UNIDADES PAGANTES DO PERÍODO' },
//     { codigo: 6, nome: 'RELAÇÃO DE UNIDADES COM VALORES AGUARDANDO CONFIRMAÇÃO BANCÁRIA' },
//     { codigo: 7, nome: 'UNIDADES PAGANTES DO PERÍODO TAXA COAMBIENTAL' },
//     { codigo: 8, nome: 'RELAÇÃO DE UNIDADES COM VALORES AGUARDANDO CONFIRMAÇÃO BANCÁRIA' },
//     { codigo: 9, nome: 'UNIDADES PAGANTES DO PERÍODO TAXA EXTRA CONFORME A.G.E.' },
//     { codigo: 10, nome: 'RELAÇÃO DE UNIDADES COM VALORES AGUARDANDO CONFIRMAÇÃO BANCÁRIA' },
//     { codigo: 11, nome: 'UNIDADES / PERÍODOS COM VALORES SEM CONFIRMAÇÃO BANCÁRIA' },
// ];

export default function Cadastro(props) {

    // const [currentStep, setCurrentStep] = useState(1)
    // const stepsLength = 2


    const [arquivos, setArquivos] = useState({ valid: false, errorMessage: "", value: {} })
    const [periodo, setPeriodo] = useState({ valid: false, errorMessage: "", value: "" })

    const [stepTrigered, setStepTrigered] = useState(0)
    const [hasLoaded, setHasLoaded] = useState(false)


    const history = useHistory();
    const { permissao } = usePermissao('prestacao-contas')
    let { id } = useParams();

    useEffect(() => {
        let mounted = true

        if (id && !hasLoaded) {
            api().get(`prestacao-contas/${id}`).then(response => {

                if (mounted) {
                    setHasLoaded(true)
                    setPeriodo({ valid: true, errorMessage: "", value: moment(response.data.periodo).format('YYYY-MM') })
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

        let fields = { periodo, arquivos }
        let valid = true
        let formData = {}

        if (id) {
            delete fields.arquivos

            Object.keys(fields).forEach(fieldName => {
                if (!fields[fieldName].valid) valid = false

                
                if  (fieldName === 'periodo'){
                    formData[fieldName] = moment(periodo.value, 'YYYY-MM').format('YYYY-MM-DD')
                } else {
                    formData[fieldName] = fields[fieldName].value
                }
            })

        } else {
            formData = new FormData();

            Object.keys(fields).forEach(fieldName => {
                if (!fields[fieldName].valid) valid = false

                if (fieldName === 'arquivos') {
                    if ('acceptedFiles' in fields[fieldName].value) {
                        fields[fieldName].value.acceptedFiles.map(file => formData.append(`${fieldName}[]`, file))
                    }
                }else if  (fieldName === 'periodo'){
                    formData.append(fieldName, moment(periodo.value, 'YYYY-MM').format('YYYY-MM-DD'))
                } else {
                    formData.append(fieldName, fields[fieldName].value);
                }
            })
        }


        if (valid) {
            setStepTrigered(0)

            if (id) {
                api().patch(`prestacao-contas/${id}`, formData).then(response => history.push('/contas'))
            } else {
                api().post('prestacao-contas', formData).then(response => history.push('/contas'))
            }
        }
    }


    return <div className='form-wrapper'>

        {permissao.modulo && (!permissao.acessar || !permissao.criar) && <Redirect to='/nao-permitido' />}
        {permissao.modulo && id && (!permissao.acessar || !permissao.editar) && <Redirect to='/nao-permitido' />}

        <BackBtn />
        <h1>{typeof id === 'undefined' ? 'Cadastrar nova ' : 'Editar '} prestação de contas</h1>
        <p>Informe o histórico de receitas e depesas.</p>


        {/* <div className='form-steps-container'>
            <h1>Dados do ocorrência</h1>
            <p>Descreva a ocorrência em detalhes e adicione arquivos.</p>
            <FormSteps>
                <FormStep current={currentStep} onClick={setCurrentStep}>Arquivo PDF</FormStep>
                <FormStep current={currentStep} onClick={setCurrentStep}>Despesas</FormStep>
                <FormStep current={currentStep} onClick={setCurrentStep}>Receitas e pagamentos</FormStep>
            </FormSteps>
        </div> */}

        {/* {currentStep === 1 && <form> */}
        <form>

            {!id && <FormInput
                type='dropzone'
                name='Arquivo'
                validation='required'
                accept='Application/pdf'
                defaultValue={arquivos}
                setValue={setArquivos}
                trigger={stepTrigered}
                noLabel
            />}


            <FormInput
                type='month'
                name='Período da prestação de contas'
                tooltip='Mês referente aos dados vinculados no arquivo'
                defaultValue={periodo}
                setValue={setPeriodo}
                trigger={stepTrigered}
            />

            <div className='form-controls'>
                <button className='btn-secondary' onClick={() => history.push('/contas')}>Cancelar</button>
                <button className='btn-primary' onClick={submit}>Concluir</button>
            </div>
        </form>
        {/* </form>} */}
    </div>
}