import { useEffect, useState } from 'react';
import api from '../../../Service/api';
import './Chat.scss';

export default function Chat(props) {
    
    const [proprietarios, setProprietarios] = useState([])

    console.log(proprietarios);
    useEffect(() => {
        api().get('proprietarios').then(response => setProprietarios(response.data))
        
    }, [])

    return <div>
        Modulo ChatSindica
        <section className='proprietario-list-container'>
            
            <div className='proprietario-card'>

            </div>
        </section>
    </div>
}