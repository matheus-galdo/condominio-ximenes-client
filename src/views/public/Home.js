import { Link } from "react-router-dom";

export default function Home(props){

    return (
        <>
            <p>Home</p>
            <Link to='/login'>
                Acesso
            </Link>
        </>
    )
}