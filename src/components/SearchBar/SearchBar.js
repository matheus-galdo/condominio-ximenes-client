import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import './SearchBar.scss'

export default function SearchBar(props) {
    

    const [buttonState, setButtonState] = useState(' disabled')
    const [inputValue, setInputValue] = useState(' disabled')

    function enableButton(e) {
        e.preventDefault()
        setButtonState(' enabled')   
    }

    function disableButton(e) {
        e.preventDefault()
        setButtonState(' disabled')   
    }


    return (
        <div className='search-bar-container'>
            <input type='text' className='search-bar' placeholder='Pesquisar' onChange={e => setInputValue(e.target.value)} onBlur={disableButton} onFocus={enableButton}/>
            <button className={'search-btn' + buttonState} onClick={e => props.filter(e, inputValue)}>
                <IoSearch className='search-icon'/>
            </button>
        </div>
    )
}