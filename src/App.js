import React, { Suspense, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import AuthProvider, { AuthContext } from "./Context/AuthProvider";

import './assets/scss/style.scss'
import routes from './routes'

function App() {

  const {auth} = useContext(AuthContext)

  useEffect(() => {

  }, [auth])


  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <AuthContext.Consumer>
              {ctx => {
                console.log(ctx);
                console.log('logado: ' + ctx.auth.isAuthenticated);
                let mapedRoutes = routes.map((route, i) => {
                  return <Route
                    render={({ location }) => {

                      if(route.publicRoute || (!route.publicRoute && ctx.auth.isAuthenticated)){
                        return <route.component/>
                      }else{
                        return <Redirect to='/nao-autorizado'/>
                      }
                    }}
                    
                    key={i} path={route.path}
                    exact={route.exact} />
                })

                console.log(mapedRoutes);
                // console.log(window.location.pathname);
                // // console.log(location);

                return (
                  <>
                    {mapedRoutes}
                  </>
                )
              }}
            </AuthContext.Consumer>
          </Switch>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
