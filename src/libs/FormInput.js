import { useState } from "react";

export default function FormInput(props) {


    const [value, setValue] = useState(props.defaultValue || '')


    function handleUpdate(e) {
        console.log('digitou:' + e.target.value);
        
        let value = null

        if (props.type === 'checkbox') {
            value = e.target.checked   
        }else{
            value = e.target.value
        }

        props.setValue(e.target.value)
    }


    function parseInputName(name) {

        let nameSplited = name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").split(' ')
        nameSplited.forEach((str, index) => {
            nameSplited[index] = str.toLowerCase()
        });

        return nameSplited.join('_')
    }

    let parsedName = parseInputName(props.name)

    return (
        <>
            <div className={'form-group ' + (props.className || '')}>
                <label htmlFor={parsedName}>{props.name}</label>

                {props.type === 'textarea' ?
                    <textarea value={value} id={parsedName} onChange={handleUpdate}></textarea>
                    :
                    <input value={value} type={props.type || 'text'} id={parsedName} onChange={handleUpdate}/>
                }
            </div>
        </>
    )
}