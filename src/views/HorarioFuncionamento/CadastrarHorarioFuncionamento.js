import React, { useEffect, useRef, useState } from 'react';
import { RiErrorWarningFill } from "react-icons/ri";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Redirect, useHistory } from 'react-router';
import BackBtn from '../../components/BackBtn/BackBtn';
import usePermissao from '../../Hooks/usePermissao';
import api from '../../Service/api';
import DOMPurify from 'dompurify';

import './HorarioFuncionamento.scss';

export default function CadastrarHorarioFuncionamento(props) {

    const [content, setContent] = useState(null)
    const [validatorContent, setValidatorContent] = useState({ valid: true, errorMessage: '' })

    const [hasLoaded, setLoaded] = useState(false)
    const { permissao } = usePermissao('funcionamento')
    const [hasSubmited, setHasSubmited] = useState(false)

    const ckEditorRef = useRef(null)
    const history = useHistory()

    useEffect(() => {
        let mounted = true;

        if (!hasLoaded) {
            api().get('/funcionamento').then(response => {
                if (mounted) {
                    setLoaded(true)
                    console.log(response.data);
                    setContent(DOMPurify.sanitize(response.data.conteudo))
                }
            })
        }

        return () => mounted = false;
    }, [content, hasLoaded])

    function submit(e) {
        e.preventDefault()

        if (!content || content.length === 0) {
            setValidatorContent({ valid: true, errorMessage: 'Este campo é obrigatório' })
        }

        if (validatorContent.valid && !hasSubmited) {
            setHasSubmited(true)
            api().patch(`funcionamento`, {content}).then(response => {
                history.push('/horario-de-funcionamento')
            }).catch(error => {
                setHasSubmited(false)
            })
        }
    }



    return <div className='form-wrapper'>

        <BackBtn />
        {permissao.modulo && !permissao.editar && <Redirect to='/nao-permitido' />}

        <div className={'editor-container' + (content === null ? ' loading' : '')}>
            {content !== null && <CKEditor
                ref={ckEditorRef}
                editor={ClassicEditor}
                config={{
                    toolbar: ['heading', '|', 'bold', 'italic', 'outdent', 'indent', '|', 'blockQuote', 'link', 'numberedList', 'bulletedList', 'insertTable',
                        '|', 'undo', 'redo']
                }}

                data={content}

                onChange={(e, editor) => {
                    const data = editor.getData();

                    if (data.length > 0) {
                        setValidatorContent({ valid: true, errorMessage: '' })
                    }

                    setContent(DOMPurify.sanitize(data))
                }}

                onBlur={(e, editor) => {
                    const data = editor.getData();

                    if (data.length > 0) {
                        setValidatorContent({ valid: true, errorMessage: '' })
                        return
                    }

                    setValidatorContent({ valid: false, errorMessage: "Este campo é obrigatório" })
                }}
            />}

            <span className={'validation-feedback' + (!validatorContent.valid ? ' error' : '')}>
                <RiErrorWarningFill /> {validatorContent.errorMessage}
            </span>


        </div>
        <div className='form-controls'>
            <button className='btn-secondary' onClick={() => history.push('/horario-de-funcionamento')}>Cancelar</button>
            <button className='btn-primary' onClick={submit}>Concluir</button>
        </div>
    </div>

}