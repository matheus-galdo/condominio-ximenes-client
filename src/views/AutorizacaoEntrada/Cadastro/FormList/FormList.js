import { useEffect, useState } from "react";
import FormInput from "../../../../libs/FormInput";

export default function FormList(props) {

    const [addingItem, setAddingItem] = useState(false)

    const [stepTrigered, setStepTrigered] = useState(0)

    const [naoPossuiVeiculo, setPossuiVeiculo] = useState(props.naoPossuiVeiculo)
    const [modelo, setModelo] = useState({ valid: false, errorMessage: "", value: "" })
    const [placa, setPlaca] = useState({ valid: false, errorMessage: "", value: "" })
    const [cor, setCor] = useState({ valid: false, errorMessage: "", value: "" })

    useEffect(() => {
        console.log(props);
    }, [props])

    function toggleAddingItem() {

        if (props.naoPossuiVeiculo.value) return
        setAddingItem(!addingItem)
    }

    function step2(event) {
        event.preventDefault()
        setStepTrigered(stepTrigered + 1)

        let fields = { modelo, placa, cor }


        let valid = true
        Object.keys(fields).forEach(fieldName => {
            if (!fields[fieldName].valid) valid = false
        })

        if (valid) {
            setStepTrigered(0)
            props.nextStep()
        }
    }

    function addItem(event) {
        event.preventDefault()
        setStepTrigered(stepTrigered + 1)

        let fields = { modelo, placa, cor }

        console.log(fields);

        let valid = true
        Object.keys(fields).forEach(fieldName => {
            if (!fields[fieldName].valid) valid = false
        })

        if (valid) {
            props.setItens([...props.itens, fields])
            toggleAddingItem()
        }
    }

    function step3() {
        // possuiVeiculo
        // setPossuiVeiculo

        console.log(props.naoPossuiVeiculo);
        if (false) {
            // possuiVeiculo
        }


        // props.nextStep()
    }

    function checkboxClassName() {
        return (props.naoPossuiVeiculo.value) ? 'form-list-itens disabled' : 'form-list-itens'
    }

    return (
        <div className='form-list-main'>

            {!addingItem && <>

                <div className='form-list-content'>
                    <FormInput
                        name='Locatário não possui veículo'
                        type='checkbox'
                        optional

                        // validation='required'

                        setValue={props.setNaoPossuiVeiculo}
                        defaultValue={props.naoPossuiVeiculo}
                    />


                    <div className={checkboxClassName()}>
                        <p className='form-list-counter'>{props.itens.length} veículos adicionados</p>


                            {props.itens.map((item, key) => <div className='form-list-item'>
                                <div>
                                    <p key={key}>{item.modelo.value} {item.placa.value} {item.cor.value}</p>
                                </div>

                                <button className='btn-delete'>Remover</button>
                            </div>)}

                        {(props.itens.length < 9) && <div>
                            <button className='square-btn' onClick={toggleAddingItem}>
                                <span>+</span>
                                Adicionar
                            </button>
                        </div>}
                    </div>
                </div>


                <div className='form-controls'>
                    <button className='btn-secondary' onClick={props.previousStep}>Anterior</button>
                    <button className='btn-primary' onClick={step3}>Próximo</button>
                </div>
            </>}

            {addingItem && <form>

                <FormInput name='Modelo' setValue={setModelo} defaultValue={modelo} trigger={stepTrigered} />

                <div className='form-row'>
                    <FormInput name='Placa' validation={'placaCarro'} setValue={setPlaca} defaultValue={placa} trigger={stepTrigered} />
                    <FormInput name='Cor' setValue={setCor} defaultValue={cor} trigger={stepTrigered} />
                </div>

                <div className='form-controls'>
                    <button className='btn-secondary' onClick={toggleAddingItem}>Cancelar</button>
                    <button className='btn-primary' onClick={addItem}>Adicionar</button>
                </div>
            </form>}
        </div>
    )
}