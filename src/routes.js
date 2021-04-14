import React from 'react';

const NotFound = React.lazy(() => import('./views/public/NotFound/NotFound'));
const home = React.lazy(() => import('./views/public/Home'));
const Unauthorized = React.lazy(() => import('./views/public/Unauthorized/Unauthorized'));
const login = React.lazy(() => import('./views/public/Login/Login'));


const dashboard = React.lazy(() => import('./views/Dashboard/Dashboard'));
const account = React.lazy(() => import('./views/Account/Account'));

export const routes = [
    {path: '/dashboard', exact: true, component: dashboard},
    {path: '/minha-conta', exact: true, component: account},

]


export const publicRoutes = [
    {path: '/login', exact: true, component: login},
    {path: '/nao-autorizado', exact: true, component: Unauthorized},
    {path: '/404', exact: true, component: NotFound},
    {path: '/', exact: true, component: home},
];