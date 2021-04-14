import React, { useEffect, useContext } from "react";
import {
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
            <Switch>
                {mapedRoutes}
                <Route path="*" ><Redirect to='/404' /></Route>
            </Switch>
        </>
    )
                
    

}