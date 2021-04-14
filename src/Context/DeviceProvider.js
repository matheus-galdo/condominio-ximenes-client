import React, { useContext, useEffect, useState } from "react"


export function useDeviceDetails(){

    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);
    const [orientation, setOrientation] = useState('landscape');
    const [device, setDevice] = useState('desktop');

    const MOBILE_MAX_WIDTH = 640
    const MOBILE_LARGE_MAX_WIDTH = 816
    const DESKTOP_MIN_WIDTH = 980

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    }

    useEffect(() => {
            window.addEventListener('resize', handleWindowSizeChange);
            return () => {
                window.removeEventListener('resize', handleWindowSizeChange);
            }
    }, []);
    

    setOrientation((width > height)?'landscape':'portrait')

    if (width <= MOBILE_MAX_WIDTH) {
        setDevice('mobile')
    }else if(width > MOBILE_MAX_WIDTH && width <= MOBILE_LARGE_MAX_WIDTH){
        setDevice('mobile-large')
    }else if(width > MOBILE_LARGE_MAX_WIDTH && width <= DESKTOP_MIN_WIDTH){
        setDevice('tablet')
    }else{
        setDevice('desktop')
    }

    return {
        type: device,
        orientation: orientation,
        screen: {w: width, h: height}
    }
}


export const DeviceContext = React.createContext({
    type: 'desktop',
    orientation: 'landscape',
    screen: {w: 1024, h: 720}
});


export default function DeviceProvider(props) {
 
    const context = useContext(DeviceContext)
    // const device = useDeviceDetails()
    
    useEffect(()=>{

    },[])
    console.log('a');
    
    return (
        <DeviceContext.Provider value={context}>
            {props.children}
        </DeviceContext.Provider>
    )
}