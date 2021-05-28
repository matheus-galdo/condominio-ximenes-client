import './OptionsBtn.scss';
import useOuterClick from "../../Hooks/useOuterClick";

import { HiOutlineDotsVertical, HiOutlineDotsHorizontal } from "react-icons/hi";
import { useEffect, useState } from 'react';

export default function OptionsBtn(props) {
    
    const [hide, setHide] = useState(true)
    const innerRef = useOuterClick(ev => setHide(true));


    useEffect(() => {

    }, [props.hide])

    function showList(e) {        
        e.preventDefault()
        setHide(!hide)
    }

    function triggerOption(e, option) {
        option.f(e)
        setHide(true)
    }



    return (
        <div ref={innerRef} className='options-btn-container'>
            <button className='options' onClick={showList}>
                {props.horizontal ? <HiOutlineDotsHorizontal/> : <HiOutlineDotsVertical/>}
            </button>



            <ul className={'options-list' + (hide? ' hide': '')}>
                {props.options.map((option, id) => <li key={id} onClick={event => triggerOption(event, option)}>{option.name}</li>)}
            </ul>
        </div>
    )
}