import { useEffect, useState } from "react";
import FormValidator from "../FormValidator";
import { RiErrorWarningFill } from "react-icons/ri";
import { AiFillFileText, AiOutlineCloudUpload } from "react-icons/ai";
import { MdHelp } from "react-icons/md";

import Select from 'react-select'
import ReactTooltip from 'react-tooltip';
import { useDropzone } from 'react-dropzone'
import { useCallback } from "react";


const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
function fileIsImage(file) {
    return file && acceptedImageTypes.includes(file['type'])
}

function getFileExtension(file) {
    let fileExtension = file.name.substr(file.name.lastIndexOf('.') + 1)
    return fileExtension.replace('.', '')
}


export default function FormInput(props) {

    const [parsedName] = useState(parseInputName(props.name))
    const [value, setValue] = useState({ value: props.defaultValue.value || '', valid: true, errorMessage: '' })

    const onDrop = useCallback((acceptedFiles, fileRejections) => {
        validateDropzoneField({ acceptedFiles, fileRejections })
    }, [])

    const {
        getRootProps,
        getInputProps,
        acceptedFiles,
        isDragActive,
        isDragReject,
    } = useDropzone({ onDrop, accept: props.accept || '', maxFiles: props.maxFiles || 5 })


    useEffect(() => {
        if (props.trigger > 0) {

            let dummy = { target: { value: props.defaultValue.value, checked: props.defaultValue.value } }

            if (props.type === 'dropzone') {
                dummy = props.defaultValue.value
                validateDropzoneField(dummy)
            } else if (props.type === 'checkbox') {
                validateCheckboxField(dummy)
            } else {
                validateField(dummy)
            }
        }

        return () => {
            if (props.type === 'dropzone' && value.acceptedFiles) {
                value.acceptedFiles.forEach(file => {
                    URL.revokeObjectURL(file.preview)
                });
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




    function validateDropzoneField(files) {

        let handler = { value: files, valid: true, errorMessage: '' }


        if ((typeof files !== 'object' || !('acceptedFiles' in files))) {
            handler = { value: files, valid: true, errorMessage: '' }

            if (getValidationRules().indexOf('required') >= 0) {
                handler.valid = false
                handler.errorMessage = 'Este campo é obrigatório'
            }

            props.setValue(handler)
            setValue(handler)
            return
        }

        if (files.fileRejections.length > 0) {
            handler = { value: files, valid: false, errorMessage: `O arquivo "${files.fileRejections[0].file.name}" é de um formato inválido` }
            props.setValue(handler)
            setValue(handler)
            return
        }


        files.acceptedFiles = (files.acceptedFiles.map(file => {
            
            let url = URL.createObjectURL(file)
            return Object.assign(file, {
                preview: url
            })

        }));



        let validator = FormValidator(files.acceptedFiles, getValidationRules(), props.itens, props.type)

        if (!validator.isValid) {
            let firstError = validator.errors[0].message
            handler.valid = false
            handler.errorMessage = firstError
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

        let handler = { value: e.target.value, valid: true, errorMessage: '' }
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

        let valueKey = ''
        let labelKey = ''
        let selectOptions = []

        if (props.selectConfig) {
            valueKey = props.selectConfig.valueKey || 'value'
            labelKey = props.selectConfig.labelKey || 'label'
            selectOptions = props.selectConfig.options.map(option => {
                return { value: option[valueKey], label: option[labelKey] }
            })
        }

        switch (props.type) {
            case 'textarea':
                inputField = <textarea
                    value={value.value}
                    id={parsedName}
                    onChange={handleUpdate}
                    onBlur={validateField}
                ></textarea>
                break;

            case 'checkbox':
                inputField = <input
                    placeholder={props.placeholder || ''}
                    checked={value.value}
                    type={props.type || 'text'}
                    id={parsedName}
                    onChange={validateCheckboxField}
                />
                break;

            case 'dropzone':
                let multiple = props.multiple || false


                let className = 'dropzone__input-container' + ((isDragActive) ? ' active' : '') + ((isDragReject) ? ' rejected' : '')

                let inputProps = { ...getInputProps(), multiple }

                inputField = <div {...getRootProps({ className })}>
                    <input {...inputProps} />

                    {acceptedFiles.length <= 0 ?
                        <div className='instruction'>{isDragActive ?
                            <p>Solte os arquivos aqui</p>
                            :
                            <>
                                <AiOutlineCloudUpload />
                                <p>Arraste e solte arquivos aqui</p>
                                <p className='small'>ou</p>
                                <p>clique para selecionar um arquivo</p>
                            </>
                        }</div>
                        :
                        <>
                            <p>Arquivos adicionados</p>
                            <div className='dropzone__preview'>
                                {acceptedFiles.map((file, id) => <div key={id} className='dropzone__thumb'>
                                    {fileIsImage(file) ?
                                        <img alt='preview do arquivo' src={file.preview} />
                                        :
                                        <div className='document'>
                                            <AiFillFileText />
                                            <p>{getFileExtension(file)}</p>
                                        </div>
                                    }
                                </div>)}
                            </div>
                        </>
                    }


                </div>
                break;

            case 'reactSelect':
                inputField = <Select
                    options={selectOptions}
                    value={selectOptions.filter(option => option.value === value.value)}
                    classNamePrefix='react-select'
                    onChange={selectObj => validateField({ target: { value: selectObj.value } })}
                    placeholder='Selecione...'
                />
                break;

            case 'reactMultiSelect':
                inputField = <Select
                    isMulti
                    value={selectOptions.filter(option => value.value.includes(option.value))}
                    options={selectOptions}
                    classNamePrefix='react-select'
                    onChange={selectObj => validateField({ target: { value: selectObj.map(obj => obj.value) } })}
                    placeholder='Selecione...'
                />
                break;

            case 'select':
                inputField = <select
                    value={value.value}
                    id={parsedName}
                    onChange={handleUpdate}
                    onBlur={validateField}
                >
                    {props.options.map((option, key) => <option key={key} value={option.id}>
                        {option[props.optionsKey || 'nome']}
                    </option>)}
                </select>
                break;

            default:
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
                break;
        }

        return inputField
    }


    return (
        <>
            <div data-input-type={props.type || 'text'} className={'form-group ' + (props.className || '') + (props.col ? `col-${props.col}` : '')}>
                <ReactTooltip />

                {props.type === 'checkbox' ? <>
                    <div>
                        {renderInputField()}

                        <div className='label-wrapper'>
                            {!props.noLabel && <label htmlFor={parsedName}>
                                {props.name}
                                {props.optional && props.showOptional && <span className='opcional'>(opcional)</span>}

                            </label>}
                            {props.tooltip && <p data-tip={props.tooltip}><MdHelp /></p>}
                        </div>
                    </div>

                    <span className={'validation-feedback' + (!value.valid ? ' error' : '')}>
                        <RiErrorWarningFill /> {value.errorMessage}
                    </span>
                </> : <>

                    <div className='label-wrapper'>
                        {!props.noLabel && <label htmlFor={parsedName}>
                            {props.name}
                            {props.optional && props.showOptional && <span className='opcional'>(opcional)</span>}

                        </label>}
                        {props.tooltip && <p data-tip={props.tooltip}><MdHelp /></p>}
                    </div>
                    {renderInputField()}

                    <span className={'validation-feedback' + (!value.valid ? ' error' : '')}>
                        <RiErrorWarningFill /> {value.errorMessage}
                    </span>
                </>}




            </div>
        </>
    )
}