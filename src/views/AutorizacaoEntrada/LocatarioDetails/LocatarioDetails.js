import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import BackBtn from "../../../components/BackBtn/BackBtn";
import api from "../../../Service/api";
import './LocatarioDetails.scss';

export default function LocatarioDetails(props) {

    const [locatario, setLocatario] = useState([])
    const [hasLoaded, setHasLoaded] = useState(false)
    let { id } = useParams();

    useEffect(() => {
        api().get(`locatarios/${id}`).then(response => {
            setLocatario(response.data)
            setHasLoaded(true)
        })
    }, [id])


    return (
        <div className='locatario-wrapper'>
            <BackBtn />

            {hasLoaded && <>
                
                <h1>{locatario.nome}</h1>
                <p>
                    {moment(locatario.data_chegada).format('D/MMM')} à {moment(locatario.data_saida).format('D/MMM')}
                </p>

                <p>Convidados</p>
                {locatario.convidados.map((item, key) => <div key={key} className='details-list-item'>
                    <div className='details-item-content'>
                        <span className='details-item-number'>{key + 1}</span>
                        <p>
                            {item.nome}<br />
                            <span>CPF: {item.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}</span>
                        </p>
                    </div>
                </div>)}

                <p>Veículos</p>
                {locatario.veiculos.map((item, key) => <div key={key} className='details-list-item'>
                    <div className='details-item-content'>
                        <span className='details-item-number'>{key + 1}</span>
                        <p>
                            {item.modelo} {item.cor}<br />
                            <span>Placa: {item.placa}</span>
                        </p>
                    </div>
                </div>)}

            </>}

        </div>
    )
}