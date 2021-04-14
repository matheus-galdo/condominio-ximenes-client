import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { HiMenuAlt2 } from "react-icons/hi";
import { useHistory } from "react-router";
import AccountMenu from "./AccountMenu";
import './header.scss';
export default function Header(props) {
    
    const [showAccountMenu, setShowAccountMenu] = useState(false)
    const location = useHistory().location.pathname
    const isDashboard = (location.indexOf('dashboard') >= 1)

    function dashboardClassName() {
        return (isDashboard)?' transparent-header':''
    }

    function toggleAccountMenu() {
        setShowAccountMenu(!showAccountMenu)
    }
    
    function closeMenu() {
        setShowAccountMenu(false)
    }

    return(
        <header className={'app-header' +  dashboardClassName()}>
            <div className='header-wrapper'>
                <button className='header-btn menu-btn'>
                    <HiMenuAlt2 onClick={props.toggleMenu}/>
                </button>
                <button className='header-btn account-btn' onClick={toggleAccountMenu}>
                    <FaUserCircle/>
                </button>
            </div>
            
            <AccountMenu show={showAccountMenu} closeMenu={closeMenu}/>
        </header>
    )
}