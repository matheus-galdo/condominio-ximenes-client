import React from 'react';

const NotFound = React.lazy(() => import('./views/public/NotFound/NotFound'));
const home = React.lazy(() => import('./views/public/Home'));
const Unauthorized = React.lazy(() => import('./views/public/Unauthorized/Unauthorized'));
const login = React.lazy(() => import('./views/public/Login/Login'));


const dashboard = React.lazy(() => import('./views/Dashboard/Dashboard'));
const account = React.lazy(() => import('./views/Account/Account'));

const AutorizacaoEntrada = React.lazy(() => import('./views/AutorizacaoEntrada/AutorizacaoEntrada'));
const AutorizacaoEntrada_Cadastro = React.lazy(() => import('./views/AutorizacaoEntrada/Cadastro'));

export const routes = [
    {path: '/dashboard', exact: true, component: dashboard},
    {path: '/minha-conta', exact: true, component: account},
    {path: '/autorizacao-de-entrada', exact: true, component: AutorizacaoEntrada},
    {path: '/autorizacao-de-entrada/cadastro', exact: true, component: AutorizacaoEntrada_Cadastro},

    
]


export const publicRoutes = [
    {path: '/login', exact: true, component: login},
    {path: '/nao-autorizado', exact: true, component: Unauthorized},
    {path: '/404', exact: true, component: NotFound},
    {path: '/', exact: true, component: home},
];