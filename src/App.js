import React, { Suspense, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
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