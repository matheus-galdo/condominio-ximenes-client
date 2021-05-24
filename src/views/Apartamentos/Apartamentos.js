import { useEffect, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import BackBtn from '../../components/BackBtn/BackBtn';
import FilterBy from '../../components/FilterBy/FilterBy';
import OptionsBtn from '../../components/OptionsBtn/OptionsBtn';
import Pagination from '../../components/Pagination/Pagination';
import SearchBar from '../../components/SearchBar/SearchBar';
import usePermissao from '../../Hooks/usePermissao';
import api from '../../Service/api';

export default function Apartamentos(props) {

    const [apartamentosOriginal, setApartamentosOriginal] = useState([])
    const [apartamentos, setApartamentos] = useState([])
    const [hasLoaded, setHasLoaded] = useState(false)

    const history = useHistory();
    const { permissao } = usePermissao('apartamentos')

    const [page, setPage] = useState(1)
    const [orderBy, setOrderBy] = useState('data_cadastro_recentes')
    const [originalData, setOriginalData] = useState(null)

    const [filterOptions] = useState([
        { nome: 'Cadastro mais recente', f:() =>  {setOrderBy('data_cadastro_recentes'); setHasLoaded(false)} },
        { nome: 'Cadastro mais antigo', f:() =>  {setOrderBy('data_cadastro_antigas'); setHasLoaded(false)} },
        { nome: 'Número', f: () => {setOrderBy('numero'); setHasLoaded(false)} },
        { nome: 'Desativados', f: () => {setOrderBy('desativado'); setHasLoaded(false)} },
        { nome: 'Ativados', f: () => {setOrderBy('ativado'); setHasLoaded(false)} },
        { nome: 'Todos', f: () => {setOrderBy('todos'); setHasLoaded(false)} },
    ])

    useEffect(() => {
        document.title = "Apartamentos"
    }, []);

    useEffect(() => {
        let mounted = true
        if (!hasLoaded) {
            api().get(`apartamentos?proprietarios=true&page=${page}&filter=${orderBy}`).then(response => {

                if (mounted) {
                    setHasLoaded(true)
                    setApartamentos(response.data.data)
                    setApartamentosOriginal(response.data.data)
                    setOriginalData(response.data)
                }
            })
        }

        return () => mounted = false
    }, [apartamentos, hasLoaded, page, orderBy])


    function changePage(value) {
        setHasLoaded(false)
        setPage(value)
    }

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
        <FilterBy options={filterOptions}/>


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

        {(originalData || hasLoaded) && <Pagination itens={originalData} setPage={changePage} page={page}/>}
        
    </div>
}