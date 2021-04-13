import { FaUserCircle } from "react-icons/fa";
import { HiMenuAlt2 } from "react-icons/hi";
import './header.scss';
export default function Header(props) {
    
    return(
        <header className={'app-header' + (props.transparent? ' transparent-header':'') }>
            <button className='menu-btn'>
                <HiMenuAlt2/>
            </button>
            <button className='account-btn'>
                <FaUserCircle/>
            </button>
        </header>
    )
}