import { useContext, useEffect, useState } from "react"
import { IoNotificationsOutline } from "react-icons/io5";
import Pagination from "../../components/Pagination/Pagination";
import { UserContext } from "../../Context/UserProvider";
import api from "../../Service/api";
import AlertCard from "./AlertCard/AlertCard";


import './dashboard.scss';

export default function Dashboard(props) {

    const [alerts, setAlerts] = useState([])
    const { user } = useContext(UserContext)

    const [page, setPage] = useState(1)
    const [originalData, setOriginalData] = useState(null)
    const [hasLoaded, setHasLoaded] = useState(false)

    useEffect(() => {
        let mounted = true
        if (!hasLoaded) {
            api().get(`dashboard?page=${page}`).then(response => {
                if (mounted) {
                    setHasLoaded(true)
                    setAlerts(response.data.data)
                    setOriginalData(response.data)
                }
            })
        }

        return () => mounted = false
    }, [hasLoaded, page])

    useEffect(() => {
        document.title = "Condomínio Ximenes 2"
    }, []);

    function changePage(value) {
        setHasLoaded(false)
        setPage(value)
    }

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
                        {alerts.map((alert, id) => <AlertCard key={id} title={alert.titulo} content={alert.descricao} />)}
                    </div>

                    {(originalData || hasLoaded) && <Pagination itens={originalData} setPage={changePage} page={page} />}
                </div>
            </div>

        </>
    )
}