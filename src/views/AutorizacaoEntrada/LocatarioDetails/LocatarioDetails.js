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
        <div className='details-wrapper'>
            <BackBtn />

            {hasLoaded && <>
                
                <h1>{locatario.nome}</h1>

                <p><span className='bold'>Período da locação:</span> {moment(locatario.data_chegada).format('D/MMM')} à {moment(locatario.data_saida).format('D/MMM')}</p>
                <p><span className='bold'>CPF:</span> {locatario.cpf}</p>
                <p><span className='bold'>E-mail:</span> {locatario.email}</p>
                <p><span className='bold'>Celular:</span> {locatario.celular}</p>

                <h3>Apartamento</h3>
                <div className='details-list-item'>
                    <div className='details-item-content'>
                        <span className='details-item-number'>1</span>
                        <p>
                            Apartamento {locatario.apartamento.numero} {locatario.apartamento.bloco}<br />
                            <span>{locatario.apartamento.andar}° andar</span>
                        </p>
                    </div>
                </div>

                <h3>Convidados</h3>
                {locatario.convidados.map((item, key) => <div key={key} className='details-list-item'>
                    <div className='details-item-content'>
                        <span className='details-item-number'>{key + 1}</span>
                        <p>
                            {item.nome}<br />
                            <span>CPF: {item.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}</span>
                        </p>
                    </div>
                </div>)}

                <h3>Veículos</h3>
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