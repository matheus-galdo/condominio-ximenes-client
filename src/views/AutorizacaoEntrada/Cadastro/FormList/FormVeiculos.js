import { useEffect, useState } from "react";
import FormInput from "../../../../libs/FormInput/FormInput";

export default function FormList(props) {

    const [isAddingItem, setIsAddingItem] = useState(false)
    const [isEditingItem, setIsEditingItem] = useState(false)
    const [editingItemId, setEditingItemId] = useState(null)

    const [stepTrigered, setStepTrigered] = useState(0)

    const [modelo, setModelo] = useState({ valid: false, errorMessage: "", value: "" })
    const [placa, setPlaca] = useState({ valid: false, errorMessage: "", value: "" })
    const [cor, setCor] = useState({ valid: false, errorMessage: "", value: "" })

    useEffect(() => {

    }, [props, props.stepTrigered])


    function toggleIsAddingItem(e) {
        e.preventDefault()
        if (props.naoPossuiVeiculo.value) return
        setIsAddingItem(!isAddingItem);
    }


    function toggleIsEditingItem(e, id) {
        let item = props.itens[id];
        setEditingItemId(id)

        setModelo(item.modelo)
        setPlaca(item.placa)
        setCor(item.cor)
        setIsEditingItem(true);
        setIsAddingItem(true)
    }

    function cancelItem(e) {
        e.preventDefault()
        if (props.naoPossuiVeiculo.value) return
        setIsAddingItem(false);
        setIsEditingItem(false);

        setModelo({ valid: false, errorMessage: "", value: "" })
        setPlaca({ valid: false, errorMessage: "", value: "" })
        setCor({ valid: false, errorMessage: "", value: "" })
    }


    function saveItem(event) {
        console.log(stepTrigered);
        setStepTrigered(stepTrigered + 1)
        event.preventDefault()

        let fields = { modelo, placa, cor }

        let valid = true
        Object.keys(fields).forEach(fieldName => {
            if (!fields[fieldName].valid) valid = false
        })

        if (valid) {
            let itens = [...props.itens, fields]

            
            if(isEditingItem){
                itens = [...props.itens]

                if(itens[editingItemId].id) {
                    let id = itens[editingItemId].id
                    fields = { ...fields, id}
                }
                itens[editingItemId] = fields
            }


            props.setItens(itens)            
            cancelItem(event)
            setStepTrigered(0)
        }
        props.setStepTrigered(props.stepTrigered + 1)
    }


    function step3(event) {
        event.preventDefault()
        props.setStepTrigered(props.stepTrigered + 1)

        let fields = { naoPossuiVeiculo: props.naoPossuiVeiculo }

        let valid = true
        Object.keys(fields).forEach(fieldName => {
            if (!fields[fieldName].valid) valid = false
        })

        console.log(valid, fields);

        if (valid) {
            props.setStepTrigered(0)
            props.nextStep()
        }
    }
    

    function checkboxClassName() {
        return (props.naoPossuiVeiculo.value) ? 'form-list-itens disabled' : 'form-list-itens'
    }

    

    return (
        <div className='form-list-main'>

            {!isAddingItem && <>

                <div className='form-list-content'>
                    <FormInput
                        name='Locatário não possui veículo'
                        type='checkbox'
                        optional
                        itens={props.itens}
                        validation={'itens'}
                        trigger={props.stepTrigered}
                        setValue={props.setNaoPossuiVeiculo}
                        defaultValue={props.naoPossuiVeiculo}
                    />


                    <div className={checkboxClassName()}>
                        <p className='form-list-counter'>
                            {!props.naoPossuiVeiculo.value? props.itens.length: 0} veículos adicionados
                        </p>

                        {!props.naoPossuiVeiculo.value && <>
                            {props.itens.map((item, key) => <div key={key} className='form-list-item'>
                                <div className='form-item-content' onClick={(e) => toggleIsEditingItem(e, key)}>
                                    <span className='form-item-number'>{key + 1}</span>
                                    <p>
                                        {item.modelo.value} {item.cor.value}<br />
                                        <span>Placa: {item.placa.value}</span>
                                    </p>
                                </div>

                                <button className='btn-delete small-btn' onClick={() => props.removeVeiculo(key)}>Remover</button>
                            </div>)}
                        </>}

                        {(props.itens.length < 9) && <div>
                            <button className='square-btn' onClick={toggleIsAddingItem}>
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

            {isAddingItem && <form>

                <FormInput name='Modelo' setValue={setModelo} defaultValue={modelo} trigger={stepTrigered} />

                <div className='form-row'>
                    <FormInput name='Placa' validation={'placaCarro'} setValue={setPlaca} defaultValue={placa} trigger={stepTrigered} />
                    <FormInput name='Cor' setValue={setCor} defaultValue={cor} trigger={stepTrigered} />
                </div>

                <div className='form-controls'>
                    <button className='btn-secondary' onClick={cancelItem}>Cancelar</button>
                    <button className='btn-primary' onClick={saveItem}>
                        {isEditingItem ? 'Salvar' : 'Adicionar'}
                    </button>
                </div>
            </form>}
        </div>
    )
}
