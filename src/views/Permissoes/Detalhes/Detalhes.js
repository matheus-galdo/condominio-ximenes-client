import { useEffect, useState } from 'react';
import { Redirect, useHistory, useParams } from 'react-router';
import { FiCheckCircle } from "react-icons/fi";
import BackBtn from '../../../components/BackBtn/BackBtn';
import usePermissao from '../../../Hooks/usePermissao';
import api from '../../../Service/api';
import './Detalhes.scss';
import { capitalize } from '../../../libs/helpers';

export default function Detalhes(props) {

    const [permissaoItens, setPermissaoItens] = useState({})
    const [hasLoaded, setHasLoaded] = useState(false)
    let { id } = useParams();
    const history = useHistory();

    const { permissao } = usePermissao('permissoes')


    useEffect(() => {
        if (!hasLoaded && !permissaoItens.permissoes_with_modulo) {
            api().get(`permissoes/${id}`).then(response => {
                setPermissaoItens(response.data)
                setHasLoaded(true)
            })
        }
    }, [hasLoaded, id, permissaoItens])


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

    function parseModuleName(name) {
        return capitalize(name.replace('-', ' '))
    }

    function submit(e) {
        e.preventDefault()

        let formData = {
            nome: permissaoItens.nome,
            isAdmin: permissaoItens.is_admin,
            permissoes: permissaoItens.permissoes_with_modulo
        }

        api().put(`permissoes/${permissaoItens.id}`, formData).then(response => history.push('/permissoes'))
    }


    return <div className='details-wrapper'>
        {permissao.modulo && (!permissao.acessar || !permissao.visualizar) && <Redirect to='/dashboard' />}

        <BackBtn />

        {hasLoaded && <>

            <h1>{capitalize(permissaoItens.nome)}</h1>

            <div className='permissions-list'>

                {permissaoItens.permissoes_with_modulo.map((item, key) => <div key={key} className='permission-row-item'>

                    <div className='permission-title'>
                        <div>
                            <input onClick={() => togglePermission(key, 'acessar')}
                                type='checkbox' defaultChecked={item.acessar} />
                        </div>
                        <div className={'title' + (!item.acessar ? ' disabled' : '')}>
                            {parseModuleName(item.modulo.label)}
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

                {permissao.modulo && permissao.editar &&
                    <div className='form-controls'>
                        <button className='btn-secondary' onClick={() => history.push('/permissoes')}>Cancelar</button>
                        <button className='btn-primary' onClick={submit}>Salvar</button>
                    </div>
                }
            </div>
        </>}

    </div>
}