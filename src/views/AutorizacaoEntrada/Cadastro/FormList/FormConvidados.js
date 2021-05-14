import { useEffect, useState } from "react";
import FormInput from "../../../../libs/FormInput/FormInput";

export default function FormList(props) {

    const [isAddingItem, setIsAddingItem] = useState(false)
    const [isEditingItem, setIsEditingItem] = useState(false)
    const [editingItemId, setEditingItemId] = useState(null)

    const [stepTrigered, setStepTrigered] = useState(0)

    const [nomeConvidado, setNomeConvidado] = useState({ valid: false, errorMessage: "", value: "" })
    const [cpf, setCpf] = useState({ valid: false, errorMessage: "", value: "" })
    const [celular, setCelular] = useState({ valid: false, errorMessage: "", value: "" })
    const [email, setEmail] = useState({ valid: false, errorMessage: "", value: "" })
    const [observacoes, setObservacoes] = useState({ valid: true, errorMessage: "", value: "" })


    useEffect(() => {
        console.log('props trigger',props.stepTrigered);
    }, [props, props.stepTrigered])

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
        setCelular(item.celular)
        setEmail(item.email)
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
        setCelular({ valid: false, errorMessage: "", value: "" })
        setEmail({ valid: false, errorMessage: "", value: "" })
        setObservacoes({ valid: false, errorMessage: "", value: "" })
    }



    function saveItem(event) {
        setStepTrigered(stepTrigered + 1)
        event.preventDefault()

        let fields = { nomeConvidado, cpf, celular, email, observacoes }

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

    console.log('alo');

    function submit(event) {
        event.preventDefault()
        props.setStepTrigered(props.stepTrigered + 1)

        console.log(props.stepTrigered);

        let fields = { naoPossuiConvidados: props.naoPossuiConvidados }

        let valid = true
        Object.keys(fields).forEach(fieldName => {
            if (!fields[fieldName].valid) valid = false
        })

        console.log(valid, fields);

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
                            {!props.naoPossuiConvidados.value? props.itens.length: 0} de 9 convidados adicionados
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
                    <button className='btn-primary' onClick={submit}>Concluir</button>
                </div>
            </>}

            {isAddingItem && <form>

                <FormInput name='Nome do Locatário' setValue={setNomeConvidado} defaultValue={nomeConvidado} trigger={stepTrigered} />
                <FormInput setValue={setCpf} name='CPF' placeholder='Ex: 000.000.000-00' validation={'required|cpf'} defaultValue={cpf} trigger={stepTrigered} />
                <FormInput name='Celular' type='tel' setValue={setCelular} placeholder='Ex: 00 00000-0000' validation={'telefone'} defaultValue={celular} trigger={stepTrigered} />
                <FormInput name='E-mail' type='email' setValue={setEmail} validation={'email'} defaultValue={email} trigger={stepTrigered} />
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
