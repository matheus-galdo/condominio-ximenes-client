import { useEffect, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import BackBtn from '../../components/BackBtn/BackBtn';
import OptionsBtn from '../../components/OptionsBtn/OptionsBtn';
import SearchBar from '../../components/SearchBar/SearchBar';
import usePermissao from '../../Hooks/usePermissao';
import api from '../../Service/api';

export default function Usuarios(props) {

    const [usuariosOriginal, setUsuariosOriginal] = useState([])
    const [usuarios, setUsuarios] = useState([])
    const [hasLoaded, setHasLoaded] = useState(false)

    const history = useHistory();
    const { permissao } = usePermissao('usuarios')


    useEffect(() => {
        if (!hasLoaded) {
            api().get('usuarios').then(response => {
                setUsuarios(response.data)
                setUsuariosOriginal(response.data)
                setHasLoaded(true)
            })
        }
    }, [usuarios, hasLoaded])


    function filter(e) {
        let value = e.target.value.toLowerCase()

        if (value === '') {
            setUsuarios(usuariosOriginal);
            return
        }

        let filtered = usuariosOriginal.filter(usuario =>
            (usuario.name.toLowerCase().indexOf(value) >= 0) ||
            (usuario.email.toLowerCase().indexOf(value) >= 0) ||
            (usuario.type_name.nome.toLowerCase().indexOf(value) >= 0)
        )

        setUsuarios(filtered);
    }


    function getItenOptions(item, moduloName, reload) {

        let options = []

        if (permissao.editar) options.push({ name: 'Editar', f: () => history.push(`/${moduloName}/cadastro/${item.id}`) })

        if (item.deleted_at) {
            options.push({ name: 'Ativar', f: () => api().put(`${moduloName}/${item.id}`, { ativar: true }).then(response => reload(false)) })
        } else {
            options.push({ name: 'Desativar', f: () => api().put(`${moduloName}/${item.id}`, { ativar: false }).then(response => reload(false)) })
        }

        if (permissao.excluir && item.deleted_at) {
            options.push({ name: 'Excluir', f: () => api().delete(`${moduloName}/${item.id}`).then(response => reload(false)) })
        }

        return options
    }


    return <div className='module-wrapper'>

        <BackBtn />
        {permissao.modulo && !permissao.acessar && <Redirect to='/nao-permitido' />}

        <h1>Usuários</h1>

        <div className='top-module-bar'>
            <SearchBar filter={filter} />

            {permissao.criar && <Link to='/usuarios/cadastro/' className='btn-primary'>
                + Adicionar
            </Link>}
        </div>


        <div className='list-item-container'>

            {usuarios.map((usuario, id) => {

                let options = getItenOptions(usuario, 'usuarios', setHasLoaded)

                return <div key={id} className='list-item-card'>
                    <div className='list-item-card-content'>
                        <Link to={`/usuarios/${usuario.id}`}>
                            <h1>{usuario.name}</h1>
                            <p>Tipo: {usuario.type_name.nome}</p>
                            <p>Status: {usuario.deleted_at ? 'Desativado' : 'Ativado'}</p>
                        </Link>
                    </div>

                    {permissao.gerenciar && <OptionsBtn options={options} />}
                </div>
            })}
        </div>


    </div>
}