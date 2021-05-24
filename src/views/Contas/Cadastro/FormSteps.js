import React from "react";

export default function FormSteps(props) {

    const children = props.children.map((formStep, id) => {
        return React.cloneElement(formStep, { number: id + 1, key: id });
    })

    return (
        <div className='form-steps-wrapper'>
            {children}
        </div>
    )
}