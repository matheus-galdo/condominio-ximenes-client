import { IoMdCopy } from "react-icons/io";
import ReactTooltip from "react-tooltip";
import { clipboard } from "../../libs/helpers";
import './ClipboardBtn.scss'

export default function ClipboardBtn(props) {

    return (
        <>
            <ReactTooltip />
            <button
                data-tip={"Copiar para área de transferência"}
                className='clipboard-btn'
                onClick={e => clipboard(e, props.value)}
            >
                <IoMdCopy />
            </button>
        </>
    )
}

