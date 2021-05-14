import { IoSearch } from "react-icons/io5";
import './SearchBar.scss'

export default function SearchBar(props) {
    
    return (
        <div className='search-bar-container'>
            <input type='text' className='search-bar' placeholder='Pesquisar' onChange={props.filter}/>
            <IoSearch className='search-icon'/>
        </div>
    )
}