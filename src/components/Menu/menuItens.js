import {RiEditBoxFill} from "react-icons/ri"
import {ImExit, ImHammer2} from "react-icons/im";
import {IoDocumentSharp} from "react-icons/io5";
import {BsFillGearFill} from "react-icons/bs";
import {IoMdChatbubbles, IoMdNotifications} from "react-icons/io";
import {FaFileInvoiceDollar, FaPhoneAlt, FaUser, FaUsersCog, FaBuilding} from "react-icons/fa";
import {AiOutlineUnorderedList, AiFillHome, AiFillClockCircle} from "react-icons/ai";

const menuItens = [
    {name: 'Início', link:'/dashboard', moduleName: 'dashboard', icon: <AiFillHome/>},
    {name: 'Avisos', link:'/avisos', moduleName: 'avisos', icon: <IoMdNotifications/>},
    {name: 'Autorização de Entrada', link:'/autorizacao-de-entrada', moduleName: 'locatarios', icon: <ImExit/>},
    {name: 'Ocorrências', link:'/ocorrencias', moduleName: 'ocorrencias', icon: <RiEditBoxFill/>},
    {name: 'Documentos', link:'/documentos', moduleName: 'documentos', icon: <IoDocumentSharp/>},
    {name: 'Boletos', link:'/boletos', moduleName: 'boletos', icon: <FaFileInvoiceDollar/>},
    {name: 'Fale com a síndica', link:'/fale-com-a-sindica', moduleName: 'chat-sindica', icon: <IoMdChatbubbles/>},
    {name: 'Fale com a portaria', link:'/fale-com-a-portaria', moduleName: 'chat-portaria', icon: <IoMdChatbubbles/>},
    {name: 'Proprietários', link:'/proprietarios', moduleName: 'proprietarios', icon: <FaUser/>},
    {name: 'Apartamentos', link:'/apartamentos', moduleName: 'apartamentos', icon: <FaBuilding/>},
    {name: 'Usuários', link:'/usuarios', moduleName: 'usuarios', icon: <FaUsersCog/>},
    {name: 'Permissões', link:'/permissoes', moduleName: 'permissoes', icon: <BsFillGearFill/>},
    {name: 'Prestação de contas', link:'/contas', moduleName: 'prestacao-contas', icon: <AiOutlineUnorderedList/>},
    {name: 'Regras e normas', link:'/regras-e-normas', moduleName: 'regras-normas', icon: <ImHammer2/>},
    {name: 'Contatos', link:'/contatos', moduleName: 'contatos', icon: <FaPhoneAlt/>},
    {name: 'Horário de funcionamento', link:'/horario-de-funcionamento', moduleName: 'funcionamento', icon: <AiFillClockCircle/>}
]

export default menuItens