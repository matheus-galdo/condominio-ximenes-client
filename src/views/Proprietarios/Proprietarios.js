import { useEffect, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import BackBtn from '../../components/BackBtn/BackBtn';
import OptionsBtn from '../../components/OptionsBtn/OptionsBtn';
import SearchBar from '../../components/SearchBar/SearchBar';
import usePermissao from '../../Hooks/usePermissao';
import api from '../../Service/api';

export default function Proprietarios(props) {

    const [proprietariosOriginal, setProprietariosOriginal] = useState([])
    const [proprietarios, setProprietarios] = useState([])
    const [hasLoaded, setHasLoaded] = useState(false)

    const history = useHistory();
    const { permissao } = usePermissao('proprietarios')


    useEffect(() => {
        let mounted = true
        if (!hasLoaded) {
            api().get('proprietarios').then(response => {
                if (mounted) {
                    setProprietarios(response.data)
                    setProprietariosOriginal(response.data)
                    setHasLoaded(true)
                }
            })
        }
        return () => mounted = false
    }, [proprietarios, hasLoaded])


    function filter(e) {
        let value = e.target.value.toLowerCase()

        if (value === '') {
            setProprietarios(proprietariosOriginal);
            return
        }

        let filtered = proprietariosOriginal.filter(usuario =>
            (usuario.name.toLowerCase().indexOf(value) >= 0) ||
            (usuario.email.toLowerCase().indexOf(value) >= 0) ||
            (usuario.type_name.nome.toLowerCase().indexOf(value) >= 0)
        )

        setProprietarios(filtered);
    }


    function getItenOptions(item, moduloName, reload) {

        let options = []

        if (!Boolean(item.aprovado)) {
            if (permissao.editar) options.push({ name: 'Editar e aprovar', f: () => history.push(`/${moduloName}/cadastro/${item.id}`) })            
        }else{
            if (permissao.editar) options.push({ name: 'Editar', f: () => history.push(`/${moduloName}/cadastro/${item.id}`) })
        }


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

        <h1>Proprietários</h1>

        <div className='top-module-bar'>
            <SearchBar filter={filter} />

            {permissao.criar && <Link to='/proprietarios/cadastro/' className='btn-primary'>
                + Adicionar
            </Link>}
        </div>


        <div className='list-item-container'>

            {proprietarios.map((proprietario, id) => {

                let options = getItenOptions(proprietario, 'proprietarios', setHasLoaded)

                return <div key={id} className='list-item-card'>
                    <div className='list-item-card-content'>
                        <Link to={`/proprietarios/${proprietario.id}`}>
                            <h1>{proprietario.name}</h1>
                            <p>Tipo: {proprietario.type_name.nome}</p>
                            <p>Status: {Boolean(proprietario.aprovado) ? 
                                proprietario.deleted_at ? 'Desativado' : 'Ativado' 
                            :
                                'Aguardando aprovação'
                            }</p>
                        </Link>
                    </div>

                    {permissao.gerenciar && <OptionsBtn options={options} />}
                </div>
            })}
        </div>
    </div>
}