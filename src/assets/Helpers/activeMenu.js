import { useEffect, useState } from "react";

function ActiveMenu(initialIsVisible) {
    console.log(initialIsVisible);
    const [update, setUpdate] = useState(0)
    // let element = props.accountMenu.current

    // console.log(props);
    useEffect(() => {
        // console.log(update, element, props.show);

        // if (props.show && element == null) {
        //     console.log(update, 'ta aberto e vazio');
        //     setUpdate(update + 1)
        // }


        // if (!props.show && element !== null) {
        //     console.log(update, 'ta fechado e com o elemento');

        //     setUpdate(update + 1)

        // }


        // if (props.show && element !== null) {
        //     console.log(update, 'ta aberto e com o elemento');
        //     document.removeEventListener("click", handleOutsideMenuClick)

        // }




    }, [ update])
    // console.log(props);
    // this.element = element

    // offsetLeft: 1193
    //offsetTop

    // offsetHeight
    // offsetWidth



    // function handleOutsideMenuClick(event) {
    //     if ((event.offsetX < element.offsetLeft || event.offsetX > element.offsetLeft + element.offsetWidth)
    //         && (event.offsetY < element.offsetTop || event.offsetY > element.offsetTop + element.offsetHeight)
    //     ) {
    //         console.log('foi fora');
    //     }
    // }

    // if (element && props.show) {
    //     console.log("alou?", element);
    //     document.addEventListener("click", handleOutsideMenuClick)
    // }


    return (<></>)
}



export default ActiveMenu