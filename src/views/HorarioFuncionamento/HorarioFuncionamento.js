import { useEffect, useState } from 'react'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import BackBtn from '../../components/BackBtn/BackBtn'
import usePermissao from '../../Hooks/usePermissao'
import api from '../../Service/api'
import DOMPurify from 'dompurify';

import './HorarioFuncionamento.scss';


export default function HorarioFuncionamento(props) {

    const [content, setContent] = useState(null)
    const [hasLoaded, setLoaded] = useState(false)
    const { permissao } = usePermissao('funcionamento')


    useEffect(() => {
        let mounted = true;

        if (!hasLoaded) {
            api().get('/funcionamento').then(response => {
                if (mounted) {
                    setLoaded(true)
                    setContent(response.data.conteudo)
                }
            })
        }

        return () => mounted = false;
    }, [content, hasLoaded])

    return <div className='module-wrapper text'>
        <BackBtn />
        <h1>Horário de Funcionamento</h1>

        {permissao.modulo && !permissao.acessar && <Redirect to='/nao-permitido' />}

        <div className='top-module-bar justify-right'>
            {permissao.editar && <Link to='/horario-de-funcionamento/cadastro/' className='btn-primary'>
                Editar
            </Link>}
        </div>


        {hasLoaded && <div className='text-container' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />}

    </div>



}