import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import BackBtn from "../../components/BackBtn/BackBtn";
import FilterBy from "../../components/FilterBy/FilterBy";
import OptionsBtn from "../../components/OptionsBtn/OptionsBtn";
import Pagination from "../../components/Pagination/Pagination";
import SearchBar from "../../components/SearchBar/SearchBar";
import { UserContext } from "../../Context/UserProvider";
import api from "../../Service/api";

import './AutorizacaoEntrada.scss';

export default function AutorizacaoEntrada(props) {


    const [locatarios, setLocatarios] = useState([])
    const [locatariosOriginal, setLocatariosOriginal] = useState([])

    const [hasLoaded, setHasLoaded] = useState(false)
    const history = useHistory();

    const { user } = useContext(UserContext)

    const [page, setPage] = useState(1)
    const [orderBy, setOrderBy] = useState('data_cadastro_recentes')
    const [originalData, setOriginalData] = useState(null)

    const [filterOptions] = useState([
        { nome: 'Cadastro mais recente', f: () => { setOrderBy('data_cadastro_recentes'); setHasLoaded(false) } },
        { nome: 'Cadastro mais antigo', f: () => { setOrderBy('data_cadastro_antigas'); setHasLoaded(false) } },
        { nome: 'Nome locatário', f: () => { setOrderBy('nome'); setHasLoaded(false) } },
        { nome: 'Número do ap', f: () => { setOrderBy('numero_ap'); setHasLoaded(false) } },
        { nome: 'Desativados', f: () => { setOrderBy('desativado'); setHasLoaded(false) } },
        { nome: 'Ativados', f: () => { setOrderBy('ativado'); setHasLoaded(false) } },
        { nome: 'Todos', f: () => { setOrderBy('todos'); setHasLoaded(false) } },
    ])

    useEffect(() => {
        let mounted = true
        if (!hasLoaded) {
            api().get(`locatarios?page=${page}&filter=${orderBy}`).then(response => {
                if (mounted) {
                    setHasLoaded(true)
                    setLocatarios(response.data.data)
                    setLocatariosOriginal(response.data)
                }
            })
        }

        return () => mounted = false
    }, [hasLoaded])

    useEffect(() => {
        document.title = "Autorização de entrada"
    }, []);

    function changePage(value) {
        setHasLoaded(false)
        setPage(value)
    }

    function filter(e) {
        let value = e.target.value.toLowerCase()

        if (value === '') {
            setLocatarios(locatariosOriginal);
            return
        }

        let filtered = locatarios.filter(locatario =>
            (locatario.nome.toLowerCase().indexOf(value) >= 0) ||
            (locatario.user.name.toLowerCase().indexOf(value) >= 0) ||
            (moment(locatario.data_chegada).format('L').indexOf(value) >= 0)
        )

        setLocatarios(filtered);
    }

    function deleted(item) {

        let list = [...locatariosOriginal]
        let index = list.indexOf(item)
        list.splice(index, 1)

        setLocatarios(list)
        setLocatariosOriginal(list)
    }


    return (
        <div className='module-wrapper'>

            <BackBtn />

            <h1>Autorização Entrada</h1>
            <div className='top-module-bar'>
                <SearchBar filter={filter} />

                <Link to='/autorizacao-de-entrada/cadastro/' className='btn-primary'>
                    + Adicionar
                </Link>
            </div>
            <FilterBy options={filterOptions} />

            <div className="list-item-container">
                {locatarios.map((locatario, id) => {

                    const options = [
                        { name: 'Editar', f: () => history.push('/autorizacao-de-entrada/cadastro/' + locatario.id) },
                        { name: 'Excluir', f: () => api().delete('locatario/' + locatario.id).then(response => deleted(locatario)) }
                    ]

                    return <div key={id} className='list-item-card'>
                        <div className='list-item-card-content'>
                            <Link to={'/autorizacao-de-entrada/' + locatario.id}>
                                <h1>{locatario.nome}</h1>
                                <p>{moment(locatario.data_chegada).format('L')}</p>
                                {<p>Apartamento: {locatario.apartamento.numero} {locatario.apartamento.bloco} - {locatario.apartamento.andar}° andar</p>}
                            </Link>
                        </div>

                        {user.type === 1 && <OptionsBtn options={options} />}
                    </div>
                })}
            </div>
            {(locatariosOriginal || hasLoaded) && <Pagination itens={locatariosOriginal} setPage={changePage} page={page} />}

        </div>
    )
}