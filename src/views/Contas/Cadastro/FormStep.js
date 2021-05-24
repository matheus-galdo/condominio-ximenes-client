import { useEffect, useState } from "react";

export default function FormStep(props) {

    const [currentStep, setCurrentStep] = useState(false)

    useEffect(() => {
        setCurrentStep((props.current === props.number)) 
    }, [props])


    return (
        <div onClick={() => props.onClick(props.number || 1)} className={'form-step' + ((currentStep)? ' active': '')}>
            <span className='step-number'>{props.number || 1}</span>
            <p className='step-content'>{props.children || props.content || 'default'}</p>
        </div>
    )
}