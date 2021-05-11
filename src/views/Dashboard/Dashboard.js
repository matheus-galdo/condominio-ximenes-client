import { useContext, useEffect, useState } from "react"
import { IoNotificationsOutline } from "react-icons/io5";
import { UserContext } from "../../Context/UserProvider";
import api from "../../Service/api";
import AlertCard from "./AlertCard/AlertCard";


import './dashboard.scss';

export default function Dashboard(props) {

    const [alerts, setAlerts] = useState([])
    const { user } = useContext(UserContext)
    
    useEffect(() => {
        api().get('dashboard').then(response => {
            setAlerts(response.data)
        })
    }, [])

    return (
        <>
            <div className="top-container">
                <h1>Olá, {user.name}</h1>
            </div>

            <div className='dashboard-wrapper'>
                <div className='dashboard-content-area'>
                    <div className='dashboard-content-area-header'>
                        <IoNotificationsOutline />
                        <h1>Avisos</h1>
                    </div>
                    <div className='dashboard-alerts'>
                        {alerts.map((alert,id) => <AlertCard key={id} title={alert.titulo} content={alert.descricao}/>)}
                    </div>
                </div>
            </div>
        </>
    )
}