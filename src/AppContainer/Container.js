import { useState } from "react";
import { useHistory } from "react-router";
import Header from "../components/Header/Header";
import Menu from "../components/Menu/Menu";
import Content from "./Content";

export default function Container(params) {

    const [showMenu, setShowMenu] = useState(false)
    const location = useHistory().location.pathname
    const isDashboard = (location.indexOf('dashboard') >= 1)

    function dashboardClassName() {
        return (isDashboard) ? ' dashboard' : '';
    }




    function toggleMenu() {
        setShowMenu(!showMenu)
    }




    return (
        <div className="app-main-container">
            <Menu showMenu={showMenu} toggleMenu={toggleMenu} />
            <div className='app-wrapper'>
                <Header toggleMenu={toggleMenu} />

                <div className={"content-wrapper" + dashboardClassName()}>
                    <Content />
                </div>
            </div>
        </div>
    )
}