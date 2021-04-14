import {RiEditBoxFill} from "react-icons/ri"
import {ImExit, ImHammer2} from "react-icons/im";
import {IoDocumentSharp} from "react-icons/io5";
import {IoMdChatbubbles} from "react-icons/io";
import {FaFileInvoiceDollar, FaPhoneAlt} from "react-icons/fa";
import {AiOutlineUnorderedList, AiFillHome, AiFillClockCircle} from "react-icons/ai";




const menu = [
    {name: 'Início', link:'/dashboard', icon: <AiFillHome/>},
    {name: 'Autorização de Entrada', link:'/autorizacao-de-entrada', icon: <ImExit/>},
    {name: 'Ocorrências', link:'/ocorrencias', icon: <RiEditBoxFill/>},
    {name: 'Documentos', link:'/documentos', icon: <IoDocumentSharp/>},
    {name: 'Boletos', link:'/documentos', icon: <FaFileInvoiceDollar/>},
    {name: 'Fale com a síndica', link:'/documentos', icon: <IoMdChatbubbles/>},
    {name: 'Fale com a portaria', link:'/documentos', icon: <IoMdChatbubbles/>},
    {name: 'Prestação de contas', link:'/documentos', icon: <AiOutlineUnorderedList/>},
    {name: 'Regras e normas', link:'/documentos', icon: <ImHammer2/>},
    {name: 'Contatos', link:'/documentos', icon: <FaPhoneAlt/>},
    {name: 'Horário de funcionamento', link:'/documentos', icon: <AiFillClockCircle/>}
]

export default menu