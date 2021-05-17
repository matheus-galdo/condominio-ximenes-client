import { useEffect, useState } from 'react';
import api from '../../../Service/api';
import './DetalhesContato.scss';

export default function DetalhesContato(props) {
    
    const [proprietarios, setProprietarios] = useState([])

    // console.log(proprietarios);
    // useEffect(() => {
    //     api().get('proprietarios').then(response => setProprietarios(response.data))
        
    // }, [])

    return <aside className='chat-details-container'>
        Modulo ChatSindicaaaa
        <section className='proprietario-list-container'>
            
            <div className='proprietario-card'>

            </div>
        </section>
    </aside>
}