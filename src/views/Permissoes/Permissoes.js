import { useEffect, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import BackBtn from '../../components/BackBtn/BackBtn';
import OptionsBtn from '../../components/OptionsBtn/OptionsBtn';
import SearchBar from '../../components/SearchBar/SearchBar';
import usePermissao from '../../Hooks/usePermissao';
import api from '../../Service/api';
import './Permissoes.scss';

export default function Permissoes(props) {

    const [permissoessOriginal, setPermissoesOriginal] = useState([])
    const [permissoes, setPermissoes] = useState([])
    const [hasFeteched, setHasFeteched] = useState(false)
    const history = useHistory();

    const { permissao } = usePermissao('permissoes')

    useEffect(() => {

        if (!hasFeteched) {
            api().get('permissoes?page=1').then(response => {
                setPermissoes(response.data)
                setPermissoesOriginal(response.data)
                setHasFeteched(true)
            })
        }
    }, [hasFeteched])


    function filter(e) {
        let value = e.target.value.toLowerCase()

        if (value === '') {
            setPermissoes(permissoessOriginal);
            return
        }

        let filtered = permissoessOriginal.data.filter(permissao =>
            (permissao.titulo.toLowerCase().indexOf(value) >= 0)
        )

        setPermissoes(filtered);
    }


    function getItenOptions(permissaoItem, moduloName, reload) {

        let options = []

        if(permissao.editar) options.push({ name: 'Editar', f: () => history.push(`/${moduloName}/cadastro/` + permissaoItem.id) })                

        if (permissaoItem.deleted_at) {
            options.push({ name: 'Ativar', f: () => api().put(`${moduloName}/${permissaoItem.id}`, { ativar: true }).then(response => reload(false)) })
        } else {
            options.push({ name: 'Desativar', f: () => api().put(`${moduloName}/${permissaoItem.id}`, { ativar: false }).then(response => reload(false)) })
        }

        if(permissao.excluir && permissaoItem.deleted_at){
            options.push({ name: 'Excluir', f: () => api().delete(`${moduloName}/${permissaoItem.id}`).then(response => reload(false)) })
        }

        return options
    }

    return <div className='module-wrapper'>

        {permissao.modulo && !permissao.acessar && <Redirect to='/dashboard' />}
        <BackBtn />

        <h1>Permissões</h1>

        <div className='top-module-bar'>
            <SearchBar filter={filter} />
            {permissao.criar && <Link to='/permissoes/cadastro/' className='btn-primary'>
                + Adicionar
            </Link>}
        </div>


        <div className='list-item-container'>
            {permissoes.data && permissoes.data.map((permissaoItem, id) => {

                let options = getItenOptions(permissaoItem, 'permissoes', setHasFeteched)

                return <div key={id} className='list-item-card'>
                    <div className='list-item-card-content'>
                        <Link to={'/permissoes/' + permissaoItem.id}>
                            <h1>{permissaoItem.nome}</h1>
                            <p>Status: {permissaoItem.deleted_at ? 'Desativado' : 'Ativado'}</p>
                        </Link>
                    </div>

                    {permissao.gerenciar && <OptionsBtn options={options} />}
                </div>
            })}
        </div>


    </div>
}