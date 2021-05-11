import { useHistory } from 'react-router-dom'
import { BsChevronLeft } from "react-icons/bs";
import './BackBtn.scss'

export default function BackBtn(props) {

    const history = useHistory()

    function redirect() {
        if (props.to) {
            history.push(props.to)
            
        }else{
            history.goBack()
        }
    }

    return (
        <span onClick={redirect} className='navigation-back-btn'>
            <BsChevronLeft /> Voltar
        </span>
    )
}