import { useContext } from "react"
import { useHistory } from "react-router"
import { AuthContext } from "../../Context/AuthProvider"

export default function Dashboard(props) {

    const {setAuth} = useContext(AuthContext)
    const history = useHistory();

    function logout() {

        setAuth({ isAuthenticated: false, token: null })
        history.push('/login')

    }
    return (
        <>
            ABC

            <button onClick={logout}>
                logout
            </button>
        </>
    )
}