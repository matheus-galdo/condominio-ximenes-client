import { Link, useHistory } from 'react-router-dom'
import {BiLogOutCircle} from "react-icons/bi"
import { FaUserCircle } from "react-icons/fa";

import {GrClose} from "react-icons/gr"

import menu from './userMenu'
import './Menu.scss'
import { useEffect, useState } from 'react';



export default function Menu(props) {
    
    const [show, setShow] = useState(false)
    const location = useHistory().location.pathname
    const isDashboard = (location.indexOf('dashboard') >= 1)


    useEffect(() => {
        setShow(props.showMenu)
    },[props.showMenu])

    function dashboardClassName() {
        return (isDashboard)? ' dashboard-menu': '';
    }

    function showMenu() {
        return (show)? ' show-menu': ' hide-menu';
    }

    function closeMenu() {
        props.toggleMenu()
    }

    return(
        <nav className={'desktop-menu' + dashboardClassName() + showMenu()}>
            <button onClick={closeMenu} className='menu-close-button'>
                <GrClose/>
            </button>

            <div className='user-resume'>
                <div className='user-icon'><FaUserCircle/></div>

                <p className='user-name'>Michelle</p>
                <div className='menu-user-btns'>
                    <Link to='/minha-conta'>Minha conta</Link>
                    <span onClick={() => console.log('saindo')}><BiLogOutCircle/> Sair</span>
                </div>
                
            </div>
            <ul>
                {menu.map((item, key) => 
                    <li className="menu-item" key={key}>
                        <Link to={item.link}>
                            {item.icon}
                            {item.name}
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    )
}