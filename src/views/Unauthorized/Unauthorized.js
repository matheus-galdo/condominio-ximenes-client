import { Link } from "react-router-dom";

export default function Unauthorized(props) {

    return (
        <>
            <h1>Você não esta logado</h1>
            <Link to='/login'>Login</Link>
        </>
    )
}