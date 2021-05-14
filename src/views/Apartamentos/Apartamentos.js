import { useEffect, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import BackBtn from '../../components/BackBtn/BackBtn';
import OptionsBtn from '../../components/OptionsBtn/OptionsBtn';
import SearchBar from '../../components/SearchBar/SearchBar';
import usePermissao from '../../Hooks/usePermissao';
import api from '../../Service/api';

export default function Apartamentos(props) {

    const [apartamentosOriginal, setApartamentosOriginal] = useState([])
    const [apartamentos, setApartamentos] = useState([])
    const [hasLoaded, setHasLoaded] = useState(false)

    const history = useHistory();
    const { permissao } = usePermissao('apartamentos')


    useEffect(() => {
        let mounted = true
        if (!hasLoaded && apartamentos.length === 0) {
            api().get('apartamentos?proprietarios=true').then(response => {
                if (mounted) {
                    setHasLoaded(true)
                    setApartamentos(response.data)
                    setApartamentosOriginal(response.data)
                }
            })
        }

        return () => mounted = false
    }, [apartamentos, hasLoaded])


    function filter(e) {
        let value = e.target.value.toLowerCase()

        if (value === '') {
            setApartamentos(apartamentosOriginal);
            return
        }

        let filtered = apartamentosOriginal.filter(apartamento =>
            (apartamento.numero.toLowerCase().indexOf(value) >= 0) ||
            (apartamento.bloco.toLowerCase().indexOf(value) >= 0) ||
            (apartamento.bloco.toLowerCase().indexOf(value) >= 0)
        )

        //suposto filtro por nome do proprietário
        // ((apartamento.proprietarios.length > 0)? 
        //     apartamento.proprietarios.filter(proprietario => proprietario.user.name.indexOf(value) >= 0): false)
        // console.log(filtered);

        setApartamentos(filtered);
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

        <h1>Apartamentos</h1>

        <div className='top-module-bar'>
            <SearchBar filter={filter} />

            {permissao.criar && <Link to='/apartamentos/cadastro/' className='btn-primary'>
                + Adicionar
            </Link>}
        </div>


        <div className='list-item-container'>

            {apartamentos.map((apartamento, id) => {

                let options = getItenOptions(apartamento, 'apartamentos', setHasLoaded)

                return <div key={id} className='list-item-card'>
                    <div className='list-item-card-content'>
                        <Link to={`/apartamentos/${apartamento.id}`}>
                            <h1>Apartamento {apartamento.numero}</h1>
                            <p>Bloco: {apartamento.bloco} - {apartamento.andar}° andar</p>
                            <p>Status: {apartamento.deleted_at ? 'Desativado' : 'Ativado'}</p>
                        </Link>
                    </div>

                    {permissao.gerenciar && <OptionsBtn options={options} />}
                </div>
            })}
        </div>


    </div>
}