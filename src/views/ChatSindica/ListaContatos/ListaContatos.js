import { useEffect, useState } from 'react';
import api from '../../../Service/api';
import './ListaContatos.scss';

export default function ListaContatos(props) {
    
    const [contatos, setContatos] = useState([])

    console.log(proprietarios);
    useEffect(() => {
        // api().get('contatos-chat').then(response => setContatos(response.data))
        
    }, [])

    return <div>
        Modulo ChatSindica
        <section className='proprietario-list-container'>
            
            <div className='proprietario-card'>

            </div>
        </section>
    </div>
}