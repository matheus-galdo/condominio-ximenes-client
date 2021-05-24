import { useEffect, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import BackBtn from '../../../components/BackBtn/BackBtn';
import OptionsBtn from '../../../components/OptionsBtn/OptionsBtn';
import SearchBar from '../../../components/SearchBar/SearchBar';
import usePermissao from '../../../Hooks/usePermissao';
import api from '../../../Service/api';
import './ListaContatos.scss';








export default function ListaContatos(props) {

    const [contatos, setContatos] = useState(props.contatos || [])
    // const [contatosOriginal, setContatosOriginal] = useState(props.contatos || [])
    const history = useHistory();
    const { permissao } = usePermissao('chat-portaria')

    const [hasLoaded, setHasLoaded] = useState(false)


    useEffect(() => {
        // api().get('contatos-chat-sindica').then(response => setContatos(response.data))
        setContatos(props.contatos)
    }, [props.contatos])

    function filter(e) {
        let value = e.target.value.toLowerCase()

        if (value === '') {
            setContatos(props.contatos);
            return
        }

        let filtered = props.contatos.filter(proprietario => {
            let nome = (proprietario.name.toLowerCase().indexOf(value) >= 0)
            let email = (proprietario.email.toLowerCase().indexOf(value) >= 0)
            let telefone = (proprietario.telefone.toLowerCase().indexOf(value) >= 0)
            let aps = (proprietario.apartamentos.filter(ap => 
                (ap.numero.toLowerCase().indexOf(value) >= 0) ||
                (ap.bloco.toLowerCase().indexOf(value) >= 0) ||
                (ap.andar.toLowerCase().indexOf(value) >= 0)
            ))

            return (nome || email || telefone || aps.length > 0)
        })

        setContatos(filtered);
    }

    function getItenOptions(item, moduloName, reload) {

        let options = []

        if (permissao.excluir) {
            options.push({ name: 'Limpar conversa', f: () => api().delete(`${moduloName}/${item.id}`).then(response => reload(false)) })
        }

        return options
    }



    return <div className='contatos-container'>
        <BackBtn />
        <section className='proprietario-list-container'>

            <div className='proprietario-card'>

            </div>
        </section>



        {permissao.modulo && !permissao.acessar && <Redirect to='/nao-permitido' />}

        <div className='top-module-bar'>
            <SearchBar filter={filter} />
        </div>


        <div className='list-item-container'>

            {contatos.map((contato, id) => {

                let options = getItenOptions(contato, 'proprietarios', setHasLoaded)

                return (

                    <div key={id} className='list-item-card' onClick={e => props.openChat(e, contato)}>
                        {contato.chat ?
                            <div className='list-item-card-content'>
                                <h1>{contato.name}</h1>
                                <p>a</p>
                                {/* <p>Tipo: {contato.type_name.nome}</p> */}
                                {/* <p>Status: {contato.deleted_at ? 'Desativado' : 'Ativado'}</p> */}
                            </div>
                            :
                            <div className='list-item-card-content' onClick={e => props.openChat(e, contato)}>
                                <h1>{contato.name}</h1>
                            </div>
                        }

                        {/* {permissao.gerenciar && <OptionsBtn options={options} />} */}
                    </div>
                )
            })}
        </div>
    </div>
}