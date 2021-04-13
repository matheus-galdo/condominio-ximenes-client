import { useContext, useEffect } from "react"
import { useHistory } from "react-router"
import { AuthContext } from "../../Context/AuthProvider"
import storage from "../../libs/storage";

export default function Dashboard(props) {

    const {setAuth} = useContext(AuthContext)
    const history = useHistory();

    useEffect(() => {
        document.title = "Dashboard"
    }, []);

    function logout() {

        setAuth({ isAuthenticated: false, token: null })
        storage.removeItem('token')
        history.push('/login')

    }
    return (
        <>
            Dashboard

            <button onClick={logout}>
                logout
            </button>
        </>
    )
}