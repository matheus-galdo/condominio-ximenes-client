import React from 'react';

const home = React.lazy(() => import('./views/Home'));
const Unauthorized = React.lazy(() => import('./views/Unauthorized/Unauthorized'));
const teste = React.lazy(() => import('./views/teste'));
const dashboard = React.lazy(() => import('./views/Dashboard/Dashboard'));
const login = React.lazy(() => import('./views/Login/Login'));

const routes = [
    {path: '/teste', exact: true, component: teste},
    {path: '/dashboard', exact: true, component: dashboard},

    {path: '/login', exact: true, component: login, publicRoute: true},
    {path: '/nao-autorizado', exact: true, component: Unauthorized, publicRoute: true},
    {path: '/', exact: true, component: home, publicRoute: true},
]



export default routes;