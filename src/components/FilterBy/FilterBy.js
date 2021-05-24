import { BsChevronDown } from "react-icons/bs";
import useOuterClick from "../../Hooks/useOuterClick";
import { useEffect, useState } from 'react';
import './FilterBy.scss'


export default function FilterBy(props) {


    const [hide, setHide] = useState(true)
    const [options, setOptions] = useState(null)
    const [selectedOption, setSelectedOption] = useState(null)

    const innerRef = useOuterClick(ev => setHide(true));



    useEffect(() => {
        setOptions(props.options)
        setSelectedOption(props.options[0])
    }, [props.options])

    function showList(e) {
        e.preventDefault()
        setHide(!hide)
    }

    function triggerOption(id, option) {
        option.f()
        setHide(true)
        setSelectedOption(props.options[id])
    }

    


    return (
        <div ref={innerRef} className='filter-btn-container'>
            <div className='filter-btn-wrapper'>

                <button className='options' onClick={showList}>
                    {options && selectedOption && <>
                        {selectedOption.nome}
                        <BsChevronDown />
                    </>}
                </button>
            </div>


            {options && selectedOption && <>
                <ul className={'options-list' + (hide ? ' hide' : '')}>
                    {options.map((option, id) => <li key={id} onClick={() => triggerOption(id, option)}>{option.nome}</li>)}
                </ul>
            </>}

        </div>
    )
}

