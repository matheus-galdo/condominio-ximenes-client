import { useEffect, useState } from "react";
import BackBtn from "../../../components/BackBtn/BackBtn";
import FormInput from "../../../libs/FormInput/FormInput";
import FormSteps from "./FormSteps";

import './cadastro.scss';
import FormStep from "./FormStep";
import FormVeiculos from "./FormList/FormVeiculos";
import FormConvidados from "./FormList/FormConvidados";
import api from "../../../Service/api";
import { useHistory, useParams } from "react-router";
import moment from "moment";

export default function CadastroLocatario(props) {

    const [today] = useState(moment().format('YYYY-MM-DD'))

    const history = useHistory()
    let { id } = useParams();


    const [currentStep, setCurrentStep] = useState(1)
    const stepsLength = 3

    const [stepTrigered, setStepTrigered] = useState(0)
    const [hasLoaded, setHasLoaded] = useState(false)

    const [nomeLocatario, setNomeLocatario] = useState({ valid: false, errorMessage: "", value: "" })
    const [cpf, setCpf] = useState({ valid: false, errorMessage: "", value: "" })
    const [dataChegada, setDataChegada] = useState({ valid: false, errorMessage: "", value: "" })
    const [dataSaida, setDataSaida] = useState({ valid: false, errorMessage: "", value: "" })
    const [celular, setCelular] = useState({ valid: false, errorMessage: "", value: "" })
    const [email, setEmail] = useState({ valid: false, errorMessage: "", value: "" })
    const [observacoes, setObservacoes] = useState({ valid: true, errorMessage: "", value: "" })

    const [naoPossuiVeiculo, setNaoPossuiVeiculo] = useState({ valid: false, errorMessage: "", value: false })
    const [veiculos, setVeiculos] = useState([])

    const [naoPossuiConvidados, setNaoPossuiConvidados] = useState({ valid: true, errorMessage: "", value: false })
    const [convidados, setConvidados] = useState([])

    const [apartamento, setApartamento] = useState({ valid: false, errorMessage: "", value: '' })
    const [apartamentos, setApartamentos] = useState([])
    const [hasRequestedAps, setHasRequestedAps] = useState(false)


    const [submiting, setSubmiting] = useState(false)

    useEffect(() => {
        if (id && !hasLoaded) {
            api().get(`locatarios/${id}`).then(response => {
                let locatario = response.data

                setNomeLocatario({ valid: true, errorMessage: "", value: locatario.nome })
                setCpf({ valid: true, errorMessage: "", value: locatario.cpf })
                setDataChegada({ valid: true, errorMessage: "", value: moment(locatario.data_chegada).format('YYYY-MM-DD') })
                setDataSaida({ valid: true, errorMessage: "", value: moment(locatario.data_saida).format('YYYY-MM-DD') })
                setCelular({ valid: true, errorMessage: "", value: locatario.celular })
                setEmail({ valid: true, errorMessage: "", value: locatario.email })
                setObservacoes({ valid: true, errorMessage: "", value: locatario.observacoes || '' })
                setApartamento({ valid: true, errorMessage: "", value: locatario.apartamento_id || '' })


                setNaoPossuiVeiculo({ valid: true, errorMessage: "", value: locatario.possui_veiculos === 0 })
                let veiculosItens = locatario.veiculos.map(veiculo => {
                    return {
                        placa: { valid: true, errorMessage: "", value: veiculo.placa || '' },
                        modelo: { valid: true, errorMessage: "", value: veiculo.modelo || '' },
                        cor: { valid: true, errorMessage: "", value: veiculo.cor || '' },
                        id: { valid: true, errorMessage: "", value: veiculo.id },
                    }
                })
                setVeiculos(veiculosItens)

                setNaoPossuiConvidados({ valid: true, errorMessage: "", value: locatario.possui_convidados === 0 })
                let convidadosItens = locatario.convidados.map(convidado => {
                    return {
                        nomeConvidado: { valid: true, errorMessage: "", value: convidado.nome || '' },
                        cpf: { valid: true, errorMessage: "", value: convidado.cpf || '' },
                        celular: { valid: true, errorMessage: "", value: convidado.celular || '' },
                        email: { valid: true, errorMessage: "", value: convidado.email || '' },
                        observacoes: { valid: true, errorMessage: "", value: convidado.observacoes || '' },
                        id: { valid: true, errorMessage: "", value: convidado.id },
                    }
                })
                setConvidados(convidadosItens)
                setStepTrigered(stepTrigered + 1)
                setHasLoaded(true)
            })
        }

    }, [id, stepTrigered, hasLoaded])

    useEffect(() => {
        let mounted = true

        if (apartamentos.length === 0 && !hasRequestedAps) {
            api().get('apartamentos?proprietarios=true').then(response => {
                if (mounted) {
                    setHasRequestedAps(true)
                    setApartamentos(response.data.map(apartamento => {
                        return { value: apartamento.id, label: `${apartamento.numero} ${apartamento.bloco} - ${apartamento.andar}° andar` }
                    }))
                }
            })
        }

        return () => mounted = false
    }, [apartamentos, hasRequestedAps])

    const removeVeiculo = (index) => {
        let veiculosAdded = [...veiculos]
        veiculosAdded.splice(index, 1)
        setVeiculos(veiculosAdded)
        setStepTrigered(stepTrigered + 1)
    }

    const removeConvidado = (index) => {
        let convidadosAdded = [...convidados]
        convidadosAdded.splice(index, 1)
        setConvidados(convidadosAdded)
        setStepTrigered(stepTrigered + 1)
    }


    function submit(event) {
        event.preventDefault()

        let fields = { nomeLocatario, cpf, apartamento, dataChegada, dataSaida, celular, email, observacoes, naoPossuiVeiculo, naoPossuiConvidados }
        let formData = {}

        let valid = true
        Object.keys(fields).forEach(fieldName => {
            if (!fields[fieldName].valid) valid = false

            if (fieldName !== 'naoPossuiVeiculo' && fieldName !== 'naoPossuiConvidados') {
                formData[fieldName] = fields[fieldName].value
            }
        })


        if (valid && !submiting) {
            if (!naoPossuiVeiculo.value) {
                formData.veiculos = veiculos.map(veiculo => {
                    console.log('aa', veiculo);
                    return {
                        cor: veiculo.cor.value,
                        modelo: veiculo.modelo.value,
                        placa: veiculo.placa.value,
                    }
                })
            } else {
                formData.veiculos = []
            }

            if (!naoPossuiConvidados.value) {
                formData.convidados = convidados.map(convidado => {
                    return {
                        nomeConvidado: convidado.nomeConvidado.value,
                        cpf: convidado.cpf.value,
                        celular: convidado.celular.value,
                        crianca: convidado.crianca.value,
                        observacoes: convidado.observacoes.value,
                    }
                })
            } else {
                formData.convidados = []
            }

            console.log(valid, formData, veiculos, convidados);


            let url = (id) ? `locatarios/${id}` : 'locatarios'
            let httpVerb = (id) ? `put` : 'post'


            setSubmiting(true)
            api()[httpVerb](url, formData).then(
                response => history.push('/autorizacao-de-entrada')
            ).catch(error => 
                setSubmiting(false)
            )
        }
    }

    function previousStep(event) {
        if (currentStep > 1) setCurrentStep(currentStep - 1)
    }

    function nextStep(event) {
        if (currentStep < stepsLength) setCurrentStep(currentStep + 1)
    }


    function step2(event) {
        event.preventDefault()
        setStepTrigered(stepTrigered + 1)

        let fields = { nomeLocatario, cpf, dataChegada, dataSaida, celular, email, observacoes, apartamento }
        console.log(fields);
        let valid = true
        Object.keys(fields).forEach(fieldName => {
            if (!fields[fieldName].valid) valid = false
        })

        if (valid) {
            setStepTrigered(0)
            nextStep()
        }
    }



    return (
        <div className='app-form'>
            <BackBtn />


            <div className='form-steps-container'>
                <h1>Dados do locatário</h1>
                <p>Informe os dados do locatário para que a portaria possa liberar o seu acesso</p>
                <FormSteps>
                    <FormStep current={currentStep} onClick={setCurrentStep}>Dados do locatário</FormStep>
                    <FormStep current={currentStep} onClick={setCurrentStep}>Veículo do locatário</FormStep>
                    <FormStep current={currentStep} onClick={setCurrentStep}>Convidados do locatário</FormStep>
                </FormSteps>
            </div>


            {currentStep === 1 &&
                <>
                    <form>
                        <FormInput name='Nome do Locatário' setValue={setNomeLocatario} defaultValue={nomeLocatario} trigger={stepTrigered} />
                        <FormInput setValue={setCpf} name='CPF' placeholder='Ex: 000.000.000-00' validation={'required|cpf'} defaultValue={cpf} trigger={stepTrigered} />
                        <div className='form-row'>
                            <FormInput name='Data de chegada' type='date' min={today} setValue={setDataChegada} defaultValue={dataChegada} trigger={stepTrigered} />
                            <FormInput name='Data de saída' type='date' min={dataChegada.value || today} setValue={setDataSaida} defaultValue={dataSaida} trigger={stepTrigered} />
                        </div>
                        <FormInput
                            type='reactSelect'
                            name='Apartamentos'
                            selectConfig={{ options: apartamentos }}
                            validation={'required'}
                            defaultValue={apartamento}
                            setValue={setApartamento}
                            trigger={stepTrigered}
                        />
                        <FormInput name='Celular' type='tel' setValue={setCelular} placeholder='Ex: 00 00000-0000' validation={'telefone'} defaultValue={celular} trigger={stepTrigered} />
                        <FormInput name='E-mail' type='email' setValue={setEmail} validation={'email'} defaultValue={email} trigger={stepTrigered} />
                        <FormInput name='Observações' type='textarea' setValue={setObservacoes} optional showOptional defaultValue={observacoes} trigger={stepTrigered} />


                        <div className='form-controls'>
                            <span></span>
                            <button className='btn-primary' onClick={step2}>Próximo</button>
                        </div>
                    </form>
                </>
            }


            {currentStep === 2 &&
                <>
                    <FormVeiculos
                        naoPossuiVeiculo={naoPossuiVeiculo}
                        setNaoPossuiVeiculo={setNaoPossuiVeiculo}

                        setItens={setVeiculos}
                        itens={veiculos}
                        removeVeiculo={removeVeiculo}

                        previousStep={previousStep}
                        nextStep={nextStep}
                        stepTrigered={stepTrigered}
                        setStepTrigered={setStepTrigered}
                    />
                </>
            }


            {currentStep === 3 &&
                <>
                    <FormConvidados
                        naoPossuiConvidados={naoPossuiConvidados}
                        setNaoPossuiConvidados={setNaoPossuiConvidados}

                        setItens={setConvidados}
                        itens={convidados}
                        removeConvidado={removeConvidado}


                        previousStep={previousStep}
                        nextStep={nextStep}
                        stepTrigered={stepTrigered}
                        setStepTrigered={setStepTrigered}
                        submit={submit}
                    />
                </>
            }
        </div>
    )
}