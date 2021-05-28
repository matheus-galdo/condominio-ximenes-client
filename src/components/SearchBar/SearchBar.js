import { useRef, useState } from "react";
import { IoSearch } from "react-icons/io5";
import './SearchBar.scss'

export default function SearchBar(props) {


    const [buttonState, setButtonState] = useState(' disabled')
    const [inputValue, setInputValue] = useState(' disabled')
    const ref = useRef(null)

    function enableButton(e) {
        e.preventDefault()
        setButtonState(' enabled')
    }

    function disableButton(e) {
        e.preventDefault()
        setButtonState(' disabled')
    }

    function handleEnterKey(e) {
        e.preventDefault()
        if (e.key === "Enter" && !e.ctrlKey && !e.altKey && !e.shiftKey) {
            ref.current.blur()
            props.filter(e, inputValue)
        }
    }

    const getOtherEvents = () => {
        
        let customProps = {}
        customProps[props.event] = (e) => {
            props.filter(e, inputValue)
        }

        return customProps;
    }

    return (
        <div className='search-bar-container'>
            <input type='text' className='search-bar' placeholder={props.placeholder ? props.placeholder : 'Pesquisar'}
                ref={ref}
                onChange={e => setInputValue(e.target.value)}
                onKeyUp={handleEnterKey}
                onBlur={disableButton}
                onFocus={enableButton}

                {...getOtherEvents()}
            />

            <button className={'search-btn' + buttonState} onClick={e => props.filter(e, inputValue)}>
                <IoSearch className='search-icon' />
            </button>
        </div>
    )
}