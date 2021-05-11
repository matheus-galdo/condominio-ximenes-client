import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import api from '../../../Service/api';
import './Detalhes.scss';

export default function Detalhes(props){

    const [ocorrencia, setOcorrencia] = useState([])
    const [hasLoaded, setHasLoaded] = useState(false)
    let { id } = useParams();

    useEffect(() => {
        if (!hasLoaded) {
            api().get(`ocorrencias/${id}`).then(response => {
                setOcorrencia(response.data)
                setHasLoaded(true)
            })
        }
    }, [hasLoaded, id])

    console.log(ocorrencia);
    return <div>

    </div>
}