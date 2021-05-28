import { useEffect, useState } from 'react'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import BackBtn from '../../components/BackBtn/BackBtn'
import usePermissao from '../../Hooks/usePermissao'
import api from '../../Service/api'
import DOMPurify from 'dompurify';

import './RegrasNormas.scss';


export default function RegrasNormas(props) {

    const [content, setContent] = useState(null)
    const [hasLoaded, setLoaded] = useState(false)
    const { permissao } = usePermissao('regras-normas')


    useEffect(() => {
        let mounted = true;

        if (!hasLoaded) {
            api().get('/regras-normas').then(response => {
                if (mounted) {
                    setLoaded(true)
                    setContent(response.data.conteudo)
                }
            })
        }

        return () => mounted = false;
    }, [content, hasLoaded])
    
    useEffect(() => {
        document.title = "Regras e normas"
    }, []);

    return <div className='module-wrapper text'>
        <BackBtn />
        <h1>Regras e Normas</h1>

        {permissao.modulo && !permissao.acessar && <Redirect to='/nao-permitido' />}

        <div className='top-module-bar justify-right'>
            {permissao.editar && <Link to='/regras-e-normas/cadastro/' className='btn-primary'>
                Editar
            </Link>}
        </div>


        {hasLoaded && <div className='text-container' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />}

    </div>



}