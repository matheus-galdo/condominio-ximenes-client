import { useContext, useEffect } from "react"
import { useHistory } from "react-router"
import { isMobile } from 'react-device-detect';
import { AuthContext } from "../../Context/AuthProvider"
import storage from "../../libs/storage";
import './dashboard.scss';

export default function Dashboard(props) {

    useEffect(() => {
        document.title = "Dashboard"
    }, []);

    return (
        <>
            <AuthContext.Consumer>
                {value => console.log(value)}
            </AuthContext.Consumer>

            <div className="top-container">
                <h1>Olá, Michele</h1>
            </div>

            <div className='dashboard-wrapper'>
                <div className='dashboard-content-area'>
                    
                </div>




            </div>
        </>
    )
}