import React from 'react';

const home = React.lazy(() => import('./views/Home'));
const NotFound = React.lazy(() => import('./views/NotFound/NotFound'));

const Unauthorized = React.lazy(() => import('./views/Unauthorized/Unauthorized'));
const login = React.lazy(() => import('./views/Login/Login'));


const teste = React.lazy(() => import('./views/teste'));
const dashboard = React.lazy(() => import('./views/Dashboard/Dashboard'));

export const routes = [
    {path: '/teste', exact: true, component: teste},
    {path: '/dashboard', exact: true, component: dashboard},

]


export const publicRoutes = [
    {path: '/login', exact: true, component: login},
    {path: '/nao-autorizado', exact: true, component: Unauthorized},
    {path: '/404', exact: true, component: NotFound},
    {path: '/', exact: true, component: home},
];