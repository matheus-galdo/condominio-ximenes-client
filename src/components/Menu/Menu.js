import { Link, useHistory } from 'react-router-dom'
import { BiLogOutCircle } from "react-icons/bi"
import { FaUserCircle } from "react-icons/fa";

import { GrClose } from "react-icons/gr"

import menuItens from './menuItens'
import './Menu.scss'
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../Context/UserProvider';



export default function Menu(props) {

    const [show, setShow] = useState(false)
    const [menu, setMenu] = useState([])
    const location = useHistory().location.pathname
    const isDashboard = (location.indexOf('dashboard') >= 1)
    const { user } = useContext(UserContext)


    useEffect(() => {

    }, [user])

    useEffect(() => {
        setShow(props.showMenu)
    }, [props.showMenu])

    function dashboardClassName() {
        return (isDashboard) ? ' dashboard-menu' : '';
    }

    function showMenu() {
        return (show) ? ' show-menu' : ' hide-menu';
    }

    function closeMenu() {
        props.toggleMenu()
    }

    function renderMenuItens() {
        
        let menuActiveItens = menu

        if (menu.length === 0 && user && user.permissoes) {
            let mountedMenu = []
            menuItens.forEach(itemMenu => {
                let permissao = user.permissoes.find(permissao => permissao.modulo === itemMenu.moduleName)
                // console.log(permissao);
                if (permissao.acessar) mountedMenu.push(itemMenu)
            })
            setMenu(mountedMenu)
            menuActiveItens = mountedMenu;
        }

        
        return menuActiveItens.map((item, key) =>
            <li className="menu-item" key={key}>
                <Link onClick={closeMenu} to={item.link}>
                    {item.icon}
                    {item.name}
                </Link>
            </li>
        )
    }

    return (
        <nav className={'desktop-menu' + dashboardClassName() + showMenu()}>
            <button onClick={closeMenu} className='menu-close-button'>
                <GrClose />
            </button>

            <div className='user-resume'>
                <div className='user-icon'><FaUserCircle /></div>

                <p className='user-name'>Michelle</p>
                <div className='menu-user-btns'>
                    <Link onClick={closeMenu} to='/minha-conta'>Minha conta</Link>
                    <span onClick={() => console.log('saindo')}><BiLogOutCircle /> Sair</span>
                </div>

            </div>
            <ul>
                {renderMenuItens()}
            </ul>
        </nav>
    )
}