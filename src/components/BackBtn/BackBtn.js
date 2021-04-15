import { useHistory } from 'react-router-dom'
import { BsChevronLeft } from "react-icons/bs";
import './BackBtn.scss'

export default function BackBtn(props) {

    const history = useHistory()

    return (
        <span onClick={() => history.goBack()} className='navigation-back-btn'>
            <BsChevronLeft /> Voltar
        </span>
    )
}