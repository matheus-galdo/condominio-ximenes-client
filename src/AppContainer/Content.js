import React, { Suspense, useEffect, useContext } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";

import { routes } from '../routes'


export default function Content(props) {



    const { auth } = useContext(AuthContext)

    useEffect(() => {

    }, [auth])


    let mapedRoutes = routes.map((route, i) => {
        return <Route
            render={({ location }) => {

                if (route.publicRoute || (!route.publicRoute && auth.isAuthenticated)) {
                    return <route.component />
                } else {
                    return <Redirect to='/nao-autorizado' />
                }
            }}

            key={i} path={route.path}
            exact={route.exact} />
    })




    return (
        <>
            Content

            {console.log(mapedRoutes)}
            {/* // console.log(window.location.pathname); */}
            {/* // // console.log(location); */}
            <Switch>

                {mapedRoutes}
                <Route path="*" ><Redirect to='/404' /></Route>
            </Switch>

        </>
    )
                
    

}