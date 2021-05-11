import { useEffect, useState } from "react";
import FormValidator from "./FormValidator";
import { RiErrorWarningFill } from "react-icons/ri";

export default function FormInput(props) {

    const [parsedName] = useState(parseInputName(props.name))
    const [value, setValue] = useState({ value: props.defaultValue.value || '', valid: true, errorMessage: '' })

    useEffect(() => {

        if (props.trigger > 0) {
            let dummy = { target: { value: props.defaultValue.value, checked: props.defaultValue.value }}
            if (props.type === 'checkbox') {
                validateCheckboxField(dummy)
            } else {
                validateField(dummy)
            }
        }
    }, [props.trigger, props.defaultValue.value, props.itens, props.type])

    function parseInputName(name) {
        let nameSanitizedAndSplited = name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").split(' ')
        nameSanitizedAndSplited.forEach((str, index) => {
            nameSanitizedAndSplited[index] = str.toLowerCase()
        });

        return nameSanitizedAndSplited.join('_')
    }


    function getValidationRules() {

        let validationsRules = (props.optional) ? '' : 'required'

        if (props.validation) {
            validationsRules = props.validation

            if (typeof props.validation === 'string') {
                validationsRules += (validationsRules.indexOf('required') < 0 && !props.optional) ? '|required' : ''
            }

            if (typeof props.validation === 'object') {
                if (!validationsRules.includes('required') && !props.optional) validationsRules.push('required')
            }
        }

        return validationsRules
    }



    function handleUpdate(e) {

        let handler = {
            value: (props.type === 'checkbox') ? e.target.checked : e.target.value,
            valid: true,
            errorMessage: ''
        }

        props.setValue(handler)
        setValue(handler)
    }


    function validateCheckboxField(e) {
        
        let handler = {
            value: e.target.checked,
            valid: true,
            errorMessage: ''
        }

        let validator = FormValidator(handler.value, getValidationRules(), props.itens)


        if (!validator.isValid) {
            let firstError = validator.errors[0].message
            handler.valid = false
            handler.errorMessage = firstError
        }

        props.setValue(handler)
        setValue(handler)
    }


    function validateField(e) {

        let handler = {
            value: e.target.value,
            valid: true,
            errorMessage: ''
        }

        let validator = FormValidator(handler.value, getValidationRules())


        if (!validator.isValid) {
            let firstError = validator.errors[0].message
            handler.valid = false
            handler.errorMessage = firstError
        }

        props.setValue(handler)
        setValue(handler)
    }

    function renderInputField() {

        let inputField = {};
        
        if (props.type === 'textarea') {
            inputField = <textarea
                value={value.value}
                id={parsedName}
                onChange={handleUpdate}
                onBlur={validateField}
            ></textarea>

        } else if (props.type === 'checkbox') {
            inputField = <input
                placeholder={props.placeholder || ''}
                checked={value.value}
                type={props.type || 'text'}
                id={parsedName}
                onChange={validateCheckboxField}
            />

        } else {
            inputField = <input
                placeholder={props.placeholder || ''}
                value={value.value}
                type={props.type || 'text'}
                id={parsedName}
                min={props.min || ''}
                max={props.max || ''}
                onChange={handleUpdate}
                onBlur={validateField}
            />
        }

        return inputField
    }


    return (
        <>


            <div data-input-type={props.type || 'text'} className={'form-group ' + (props.className || '')}>

                {props.type === 'checkbox' ? <>
                    <div>
                        {renderInputField()}

                        <label htmlFor={parsedName}>
                            {props.name}
                            {props.optional && props.showOptional && <span className='opcional'>(opcional)</span>}
                        </label>
                    </div>

                    <span className='validation-feedback'>
                        {!value.valid && <><RiErrorWarningFill /> {value.errorMessage}</>}
                    </span>
                </> : <>
                    <label htmlFor={parsedName}>
                        {props.name}
                        {props.optional && props.showOptional && <span className='opcional'>(opcional)</span>}
                    </label>

                    {renderInputField()}

                    <span className='validation-feedback'>
                        {!value.valid && <><RiErrorWarningFill /> {value.errorMessage}</>}
                    </span>
                </>}



            </div>
        </>
    )
}