import { useEffect, useState } from "react";
import BackBtn from "../../components/BackBtn/BackBtn";
import FormInput from "../../libs/FormInput";

export default function CadastroLocatario(props) {

    const [nomeLocatario, setNomeLocatario] = useState('')
    const [cpf, setCpf] = useState('')
    const [dataChegada, setDataChegada] = useState('')
    const [dataSaida, setDataSaida] = useState('')
    const [celular, setCelular] = useState('')
    const [email, setEmail] = useState('')
    const [observacoes, setObservacoes] = useState('')
    const [teste, setTeste] = useState('')


    useEffect(()=>{
        
        console.log(observacoes);

    })
    
    let testeForm = [
        {name: 'nome', validation: 'required|min:5'},
        {name: 'nome', validation: 'required|min:5'},
        {name: 'nome', validation: 'required|min:5'},
    ];


    return (
        <>
            <BackBtn />
            cadastro


            
        
            <>
                Etapa 1
                <form>
                    <FormInput setValue={setNomeLocatario} name='Nome do Locatárioooo'/>
                    <FormInput setValue={setCpf} name='Nome do Locatário'/>


                    <div className='row'>
                        <FormInput setValue={setDataChegada} type='date' name='Data de chegada'/>
                        <FormInput setValue={setDataSaida} type='date' name='Data de saída'/>
                    </div>


                    <FormInput setValue={setCelular} type='tel' name='Celular'/>
                    <FormInput setValue={setEmail} type='email' name='E-mail'/>
                    
                    <FormInput setValue={setTeste} type='checkbox' name='Visitante não possui veículo'/>

                    <FormInput setValue={setObservacoes} type='textarea' name='Observações'/>

                    
                </form>

            </>
        </>
    )
}