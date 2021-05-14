import { Link } from "react-router-dom";

export default function NotAllowed(props) {

    return (
        <>
            <h1>Você não tem permissão pra acessar este recurso</h1>
            <Link to='/dashboard'>Voltar</Link>
        </>
    )
}