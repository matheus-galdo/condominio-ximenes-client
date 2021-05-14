import { useEffect, useState } from 'react';
import { Redirect, useHistory, useParams } from 'react-router';
import { FiCheckCircle } from "react-icons/fi";

import BackBtn from '../../../components/BackBtn/BackBtn';
import FormInput from '../../../libs/FormInput/FormInput';
import api from '../../../Service/api';
import './Cadastro.scss';
import usePermissao from '../../../Hooks/usePermissao';

export default function Cadastro(props) {

    const [nome, setNome] = useState({ valid: false, errorMessage: "", value: "" })
    const [isAdmin, setIsAdmin] = useState({ valid: true, errorMessage: "", value: false })
    const [stepTrigered, setStepTrigered] = useState(0)
    const [hasLoaded, setHasLoaded] = useState(false)

    const [permissaoItens, setPermissaoItens] = useState({})

    const history = useHistory();
    let { id } = useParams();
    const { permissao } = usePermissao('permissoes')
   


    useEffect(() => {
        
        if (typeof id === 'undefined' && !hasLoaded && !permissaoItens.permissoes_with_modulo) {
            api().get(`modulos`).then(response => {

                let userTypes = {}
                userTypes.permissoes_with_modulo = response.data.map(modulo => {
                    return {
                        acessar: true,
                        criar: true,
                        editar: true,
                        excluir: true,
                        gerenciar: true,
                        visualizar: true,
                        modulo: modulo,
                        modulo_sistema_id: modulo.id
                    }
                })

                setPermissaoItens(userTypes)
                setHasLoaded(true)
            })
        }
    }, [hasLoaded, id, permissaoItens])


    useEffect(() => {
        if (typeof id !== 'undefined' && !hasLoaded && !permissaoItens.permissoes_with_modulo) {
            api().get(`permissoes/${id}`).then(response => {
                setPermissaoItens(response.data)
                setNome({ valid: true, errorMessage: "", value: response.data.nome })
                setIsAdmin({ valid: true, errorMessage: "", value: response.data.is_admin })
                setStepTrigered(stepTrigered + 1)
                setHasLoaded(true)
            })
        }
    }, [id, permissaoItens, stepTrigered, hasLoaded])


    function togglePermission(index, key) {
        let copiedItens = { ...permissaoItens }
        copiedItens.permissoes_with_modulo[index][key] = !copiedItens.permissoes_with_modulo[index][key]

        if (key === 'acessar') {
            copiedItens.permissoes_with_modulo[index]['criar'] = copiedItens.permissoes_with_modulo[index][key]
            copiedItens.permissoes_with_modulo[index]['editar'] = copiedItens.permissoes_with_modulo[index][key]
            copiedItens.permissoes_with_modulo[index]['excluir'] = copiedItens.permissoes_with_modulo[index][key]
            copiedItens.permissoes_with_modulo[index]['gerenciar'] = copiedItens.permissoes_with_modulo[index][key]
            copiedItens.permissoes_with_modulo[index]['visualizar'] = copiedItens.permissoes_with_modulo[index][key]
        }
        setPermissaoItens(copiedItens)
    }


    function submit(e) {
        e.preventDefault()
        setStepTrigered(stepTrigered + 1)

        let fields = { nome, isAdmin }
        let formData = {permissoes: permissaoItens.permissoes_with_modulo}

        let valid = true
        Object.keys(fields).forEach(fieldName => {
            if (!fields[fieldName].valid) valid = false
            formData[fieldName] = fields[fieldName].value
        })

        if (valid) {
            setStepTrigered(0)

            if (id) {
                api().patch(`permissoes/${id}`, formData).then(response => history.push('/permissoes'))
            }else{
                api().post('permissoes', formData).then(response => history.push('/permissoes'))
            }
        }
    }

    return <div className='form-wrapper'>

        {permissao.modulo && (!permissao.acessar || !permissao.criar) && <Redirect to='/nao-permitido' />}
        {permissao.modulo && id && (!permissao.acessar || !permissao.editar) && <Redirect to='/nao-permitido' />}

        <BackBtn to='/permissoes' />
        <h1>Cadastrar nível de permissão</h1>
        <p>Crie um novo tipo de usuário e informe quais módulos do sistema ele poderá acessar</p>
        <form>
            <FormInput
                type='text'
                name='Nome da permissão'
                validation='required'
                defaultValue={nome}
                setValue={setNome}
                trigger={stepTrigered}
            />

            <FormInput
                type='checkbox'
                name='Permissão de administrador'
                optional
                showOptional
                defaultValue={isAdmin}
                setValue={setIsAdmin}
                trigger={stepTrigered}
            />

            {hasLoaded && <>


                <div className='permissions-list'>

                    {permissaoItens.permissoes_with_modulo.map((item, key) => <div key={key} className='permission-row-item'>

                        <div className='permission-title'>
                            <div>
                                <input onClick={() => togglePermission(key, 'acessar')}
                                    type='checkbox' defaultChecked={item.acessar} />
                            </div>
                            <div className={'title' + (!item.acessar ? ' disabled' : '')}>
                                {item.modulo.label}
                            </div>
                        </div>

                        <div className='permission-toggle'>

                            <div className='permission-toggle-item'>
                                <span className={!item.acessar ? 'disabled' : ''}>Visualizar</span>
                                <FiCheckCircle onClick={() => togglePermission(key, 'visualizar')}
                                    className={'toggle-icon' + (item.acessar && item.visualizar ? ' active' : '')} />
                            </div>
                            <div className='permission-toggle-item'>
                                <span className={!item.acessar ? 'disabled' : ''}>Criar</span>
                                <FiCheckCircle onClick={() => togglePermission(key, 'criar')}
                                    className={'toggle-icon' + (item.acessar && item.criar ? ' active' : '')} />
                            </div>
                            <div className='permission-toggle-item'>
                                <span className={!item.acessar ? 'disabled' : ''}>Editar</span>
                                <FiCheckCircle onClick={() => togglePermission(key, 'editar')}
                                    className={'toggle-icon' + (item.acessar && item.editar ? ' active' : '')} />
                            </div>
                            <div className='permission-toggle-item'>
                                <span className={!item.acessar ? 'disabled' : ''}>Gerenciar</span>
                                <FiCheckCircle onClick={() => togglePermission(key, 'excluir')}
                                    className={'toggle-icon' + (item.acessar && item.excluir ? ' active' : '')} />
                            </div>
                            <div className='permission-toggle-item'>
                                <span className={!item.acessar ? 'disabled' : ''}>Excluir</span>
                                <FiCheckCircle onClick={() => togglePermission(key, 'gerenciar')}
                                    className={'toggle-icon' + (item.acessar && item.gerenciar ? ' active' : '')} />
                            </div>
                        </div>
                    </div>)}
                </div>
            </>}

            <div className='form-controls'>
                <button className='btn-secondary' onClick={() => history.push('/permissoes')}>Cancelar</button>
                <button className='btn-primary' onClick={submit}>Salvar</button>
            </div>
        </form>
    </div>
}