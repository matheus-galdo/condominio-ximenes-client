import React, { Suspense, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import AuthProvider, { AuthContext } from "./Context/AuthProvider";
import UserProvider from "./Context/UserProvider";

import './assets/scss/style.scss'
import { publicRoutes } from './routes'
import Container from "./AppContainer/Container";
import momentConfig from './assets/moment-config'

function App() {

  const { auth } = useContext(AuthContext)

  useEffect(() => {

  }, [auth])

  return (
    <AuthProvider>
      <UserProvider>
        <Router>
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
        </UserProvider>
    </AuthProvider>
  );
}

export default App;