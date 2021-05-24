import { useEffect, useState } from "react";
import FormInput from "../../../../libs/FormInput/FormInput";
import ReactLoading from 'react-loading';

export default function FormList(props) {

    const [isAddingItem, setIsAddingItem] = useState(false)
    const [isEditingItem, setIsEditingItem] = useState(false)
    const [editingItemId, setEditingItemId] = useState(null)

    const [stepTrigered, setStepTrigered] = useState(0)

    const [nomeConvidado, setNomeConvidado] = useState({ valid: false, errorMessage: "", value: "" })
    const [cpf, setCpf] = useState({ valid: false, errorMessage: "", value: "" })
    const [celular, setCelular] = useState({ valid: true, errorMessage: "", value: "" })
    const [observacoes, setObservacoes] = useState({ valid: true, errorMessage: "", value: "" })
    const [crianca, setCrianca] = useState({ valid: true, errorMessage: "", value: false })


    let convidadosAdultos = props.itens.filter(convidado => !convidado.crianca.value)
    let convidadosCriancas = props.itens.filter(convidado => convidado.crianca.value)

    console.log(props.itens);

    // let convidadosAdultos = []
    // let convidadosCriancas =[]

    useEffect(() => {
    }, [props, props.stepTrigered, crianca])

    function toggleIsAddingItem(e) {
        e.preventDefault()
        if (props.naoPossuiConvidados.value) return
        setIsAddingItem(!isAddingItem)
    }

    function toggleIsEditingItem(e, id) {
        let item = props.itens[id];
        setEditingItemId(id)

        setNomeConvidado(item.nomeConvidado)
        setCpf(item.cpf)
        setCrianca(item.crianca)
        setCelular(item.celular)
        setObservacoes(item.observacoes)
        setIsEditingItem(true);
        setIsAddingItem(true)
    }


    function cancelItem(e) {
        e.preventDefault()
        if (props.naoPossuiConvidados.value) return
        setIsAddingItem(false);
        setIsEditingItem(false);

        setNomeConvidado({ valid: false, errorMessage: "", value: "" })
        setCpf({ valid: false, errorMessage: "", value: "" })
        setCelular({ valid: true, errorMessage: "", value: "" })
        setObservacoes({ valid: true, errorMessage: "", value: "" })
        setCrianca({ valid: true, errorMessage: "", value: false })

    }



    function saveItem(event) {
        setStepTrigered(stepTrigered + 1)
        event.preventDefault()

        let fields = { nomeConvidado, cpf, crianca, celular, observacoes }

        let valid = true
        Object.keys(fields).forEach(fieldName => {
            if (!fields[fieldName].valid) valid = false
        })

        // console.log(convidadosCriancas.length, isEditingItem, crianca.value,convidadosCriancas.length === 2 && !isEditingItem && crianca.value);

        if (((convidadosCriancas.length >= 2 && !isEditingItem) || (convidadosCriancas.length >=3 && isEditingItem)) && crianca.value) {
            // console.log('deu ruim');
            valid = false
            // setCrianca({ valid: false, errorMessage: "Você já adicionou o limite de convidados com menos de 14 anos", value: 'aabc' })        
            // setStepTrigered(stepTrigered + 2)
            // props.setStepTrigered(props.stepTrigered + 1)
        }

        if (((convidadosAdultos.length >= 7 && !isEditingItem) || (convidadosAdultos.length >=8 && isEditingItem)) && crianca.value) {
            // console.log('deu ruim');
            valid = false
            // setCrianca({ valid: false, errorMessage: "Você já adicionou o limite de convidados com menos de 14 anos", value: 'aabc' })        
            // setStepTrigered(stepTrigered + 2)
            // props.setStepTrigered(props.stepTrigered + 1)
        }
        


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

        // props.setStepTrigered(props.stepTrigered + 1)
    }


    function submit(event) {
        event.preventDefault()
        props.setStepTrigered(props.stepTrigered + 1)

        let fields = { naoPossuiConvidados: props.naoPossuiConvidados }

        let valid = true
        
        Object.keys(fields).forEach(fieldName => {
            if (!fields[fieldName].valid) valid = false
        })


        if(valid){
            props.setStepTrigered(0)

            props.submit(event)
        }
    }

    function checkboxClassName() {
        return (props.naoPossuiConvidados.value) ? 'form-list-itens disabled' : 'form-list-itens'
    }

    return (
        <div className='form-list-main'>

            {!isAddingItem && <>

                <div className='form-list-content'>
                    <FormInput
                        name='Locatário não possui convidados'
                        type='checkbox'
                        optional
                        itens={props.itens}
                        validation={'itens'}
                        trigger={props.stepTrigered}
                        setValue={props.setNaoPossuiConvidados}
                        defaultValue={props.naoPossuiConvidados}
                    />



                    <div className={checkboxClassName()}>
                        <p className='form-list-counter'>
                            {!props.naoPossuiConvidados.value? convidadosAdultos.length: 0} de 7 adultos e {!props.naoPossuiConvidados.value? convidadosCriancas.length: 0} de 2 crianças adicionados
                        </p>


                        {!props.naoPossuiConvidados.value && <>
                            {props.itens.map((item, key) => <div key={key} className='form-list-item'>
                                <div className='form-item-content' onClick={(e) => toggleIsEditingItem(e, key)}>
                                    <span className='form-item-number'>{key + 1}</span>
                                    <p>
                                        {item.nomeConvidado.value}<br />
                                        <span>{item.cpf.value}</span>
                                    </p>
                                </div>

                                <button className='btn-delete small-btn' onClick={() => props.removeConvidado(key)}>Remover</button>
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
                <p className='form-instructions'>Ao enviar essa autorização de entrada, o proprietário declara ter dado ciência das normas do regulamento interno e convenção do Condomínio Ximenes II aos ocupantes do apartamento a fim de manterem o devido cumprimento durante a estadia.</p>


                <div className='form-controls'>
                    <button className='btn-secondary' onClick={props.previousStep}>Anterior</button>
                    <button className='btn-primary' onClick={submit}>{props.submiting? <ReactLoading height={'1.6rem'} width={'1.6rem'} type={'spin'}/>: 'Concluir'}</button>
                </div>
            </>}

            {isAddingItem && <form>

                <FormInput name='Nome do Locatário' setValue={setNomeConvidado} defaultValue={nomeConvidado} trigger={stepTrigered} />
                <FormInput
                    name='Convidado menor de 7 anos'
                    type='checkbox'
                    optional
                    showOptional
                    trigger={stepTrigered}
                    setValue={setCrianca}
                    defaultValue={crianca}
                />
                <FormInput setValue={setCpf} name='CPF' placeholder='Ex: 000.000.000-00' validation={'cpf'} defaultValue={cpf} trigger={stepTrigered} />
                <FormInput name='Celular' optional showOptional type='tel' setValue={setCelular} placeholder='Ex: 00 00000-0000' validation={'telefone'} defaultValue={celular} trigger={stepTrigered} />
                <FormInput name='Observações' type='textarea' setValue={setObservacoes} optional showOptional defaultValue={observacoes} trigger={stepTrigered} />

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
