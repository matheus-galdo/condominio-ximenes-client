import { useEffect, useState } from "react"
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import './Pagination.scss'

export default function Pagination(props) {

    const [items, setItems] = useState({})

    useEffect(() => {
        if ('itens' in props) {
            if (props.itens && props.itens !== items) {
                setItems(props.itens)
            }
        }
    }, [props])

    function nextPage() {
        let pageIndex = props.page + 1
        if (pageIndex <= items.last_page) {
            props.setPage(pageIndex)
        }
    }


    function previousPage() {
        let pageIndex = props.page - 1
        if (pageIndex > 0) {
            props.setPage(pageIndex)
        }
    }



    return <section className='pagination'>
        {'links' in items && <div className="pagination__wrapper">

            {console.log(items)}
            <div className="pagination__step-btn" onClick={previousPage}>
                <AiOutlineLeft/>
            </div>

            <div className='pagination__itens-container'>


                {props.page >= 4 && <>
                    <div className='pagination__item' onClick={() => props.setPage(1)}>
                        1
                    </div>
                    <div className='pagination__separator'>
                        ...
                    </div>
                </>}



                {items.links.map((item, index) => {

                    if (items.links.length > 7) {
                        //ignora os indices depois do quinto item
                        if (props.page <= 4 && index > 5) return

                        //ignora os indices depois antes do antepenultimo item
                        if ((props.page >= items.links.length - 5) && (index < items.links.length - 6)) return

                        if((props.page >= 4 && props.page <= items.links.length - 5 && index < props.page - 1)) return
                        if((props.page >= 4 && props.page <= items.links.length - 5 && index > props.page + 1)) return
                    } 

                    //limpa o primeiro e o ultimo indice
                    if (index === 0 || index >= items.links.length - 1) return

                    return <div className={'pagination__item' + (item.active ? ' current' : '')} onClick={() => props.setPage(parseInt(item.label))}>
                        {item.label}
                    </div>
                })}
                {items.links.length > 7 && props.page < items.links.length - 4 && <>

                    <div className='pagination__separator'>
                        ...
                    </div>
                    <div className='pagination__item' onClick={() => props.setPage(items.last_page)}>
                        {items.last_page}
                    </div>
                </>}
            </div>

            <div className='pagination__step-btn' onClick={nextPage}>
                <AiOutlineRight/>
            </div>
        </div>}
    </section>
}