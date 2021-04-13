import React, { Suspense, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import AuthProvider, { AuthContext } from "./Context/AuthProvider";

import './assets/scss/style.scss'
import { publicRoutes } from './routes'
import Container from "./AppContainer/Container";

function App() {

  const { auth } = useContext(AuthContext)

  useEffect(() => {

  }, [auth])

  return (
    <AuthProvider>
      <Router>

        {/* <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} />
      <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
      <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
      <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
      <Route path="/" name="Home" render={props => <TheLayout {...props}/>} /> */}


        <Suspense fallback={<div>Loading...</div>}>
          <Switch>

            {publicRoutes.map((route, i) =>
              <Route
                component={route.component}
                key={i}
                path={route.path}
                exact={route.exact} />
            )}

            <Route path="/" component={Container} />


          </Switch>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;