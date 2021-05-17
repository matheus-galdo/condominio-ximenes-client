import React from 'react';

const NotFound = React.lazy(() => import('./views/public/NotFound/NotFound'));
const home = React.lazy(() => import('./views/public/Home'));
const Unauthorized = React.lazy(() => import('./views/public/Unauthorized/Unauthorized'));
const NotAllowed = React.lazy(() => import('./views/public/NotAllowed/NotAllowed'));
const login = React.lazy(() => import('./views/public/Login/Login'));
const Register = React.lazy(() => import('./views/public/Register/Register'));


const dashboard = React.lazy(() => import('./views/Dashboard/Dashboard'));
const account = React.lazy(() => import('./views/Account/Account'));
const account_Senha = React.lazy(() => import('./views/Account/Account'));
const account_Editar = React.lazy(() => import('./views/Account/Account'));

const AutorizacaoEntrada = React.lazy(() => import('./views/AutorizacaoEntrada/AutorizacaoEntrada'));
const AutorizacaoEntrada_Cadastro = React.lazy(() => import('./views/AutorizacaoEntrada/Cadastro/Cadastro'));
const AutorizacaoEntrada_Detalhes = React.lazy(() => import('./views/AutorizacaoEntrada/LocatarioDetails/LocatarioDetails'));

const Ocorrencias = React.lazy(() => import('./views/Ocorrencias/Ocorrencias'));
const Ocorrencias_Cadastro = React.lazy(() => import('./views/Ocorrencias/Cadastro/Cadastro'));
const Ocorrencias_Detalhes = React.lazy(() => import('./views/Ocorrencias/Detalhes/Detalhes'));


const FaleComSindica = React.lazy(() => import('./views/ChatSindica/ChatSindica'));
const FaleComSindica_Chat = React.lazy(() => import('./views/Ocorrencias/Ocorrencias'));

const FaleComPortaria = React.lazy(() => import('./views/Ocorrencias/Ocorrencias'));
const FaleComPortaria_Chat = React.lazy(() => import('./views/Ocorrencias/Ocorrencias'));

const Documentos = React.lazy(() => import('./views/Documentos/Documentos'));
const Documentos_Cadastro = React.lazy(() => import('./views/Documentos/Cadastro/Cadastro'));
const Documentos_Detalhes = React.lazy(() => import('./views/Documentos/Detalhes/Detalhes'));


const Contas = React.lazy(() => import('./views/Contas/Contas'));
const Contas_Cadastro = React.lazy(() => import('./views/Ocorrencias/Ocorrencias'));


const Boletos = React.lazy(() => import('./views/Boletos/Boletos'));
const Boletos_Cadastro = React.lazy(() => import('./views/Boletos/Cadastro/Cadastro'));
const Boletos_Detalhes = React.lazy(() => import('./views/Boletos/Detalhes/Detalhes'));


const Proprietarios = React.lazy(() => import('./views/Proprietarios/Proprietarios'));
const Proprietarios_Cadastro = React.lazy(() => import('./views/Proprietarios/Cadastro/Cadastro'));
const Proprietarios_Detalhes = React.lazy(() => import('./views/Proprietarios/Detalhes/Detalhes'));

const Apartamentos = React.lazy(() => import('./views/Apartamentos/Apartamentos'));
const Apartamentos_Cadastro = React.lazy(() => import('./views/Apartamentos/Cadastro/Cadastro'));
const Apartamentos_Detalhes = React.lazy(() => import('./views/Apartamentos/Detalhes/Detalhes'));

const Usuarios = React.lazy(() => import('./views/Usuarios/Usuarios'));
const Usuarios_Cadastro = React.lazy(() => import('./views/Usuarios/Cadastro/Cadastro'));
const Usuarios_Detalhes = React.lazy(() => import('./views/Usuarios/Detalhes/Detalhes'));

const Permissoes = React.lazy(() => import('./views/Permissoes/Permissoes'));
const Permissoes_Cadastro = React.lazy(() => import('./views/Permissoes/Cadastro/Cadastro'));
const Permissoes_Detalhes = React.lazy(() => import('./views/Permissoes/Detalhes/Detalhes'));


const Avisos = React.lazy(() => import('./views/Avisos/Avisos'));
const Avisos_Cadastro = React.lazy(() => import('./views/Avisos/Cadastro/Cadastro'));
const Avisos_Detalhes = React.lazy(() => import('./views/Avisos/Detalhes/Detalhes'));

const Contatos = React.lazy(() => import('./views/Contatos/Contatos'));
const RegrasNormas = React.lazy(() => import('./views/RegrasNormas/RegrasNormas'));
const HorarioFuncionamento = React.lazy(() => import('./views/Funcionamento/Funcionamento'));



export const routes = [
    {path: '/dashboard', exact: true, component: dashboard},

    {path: '/minha-conta', exact: true, component: account},
    {path: '/minha-conta/aletar-senha', exact: true, component: account_Senha},
    {path: '/minha-conta/editar', exact: true, component: account_Editar},

    {path: '/autorizacao-de-entrada/cadastro', exact: true, component: AutorizacaoEntrada_Cadastro},
    {path: '/autorizacao-de-entrada/cadastro/:id', exact: true, component: AutorizacaoEntrada_Cadastro},
    {path: '/autorizacao-de-entrada', exact: true, component: AutorizacaoEntrada},
    {path: '/autorizacao-de-entrada/:id', exact: true, component: AutorizacaoEntrada_Detalhes},


    {path: '/ocorrencias/cadastro', exact: true, component: Ocorrencias_Cadastro},
    {path: '/ocorrencias/cadastro/:id', exact: true, component: Ocorrencias_Cadastro},
    {path: '/ocorrencias', exact: true, component: Ocorrencias},
    {path: '/ocorrencias/:id', exact: true, component: Ocorrencias_Detalhes},



    {path: '/fale-com-a-sindica', exact: true, component: FaleComSindica},
    {path: '/fale-com-a-sindica/chat', exact: true, component: FaleComSindica_Chat},

    {path: '/fale-com-a-portaria', exact: true, component: FaleComPortaria},
    {path: '/fale-com-a-portaria/chat', exact: true, component: FaleComPortaria_Chat},


    {path: '/documentos/cadastro', exact: true, component: Documentos_Cadastro},
    {path: '/documentos/cadastro/:id', exact: true, component: Documentos_Cadastro},
    {path: '/documentos', exact: true, component: Documentos},
    {path: '/documentos/:id', exact: true, component: Documentos_Detalhes},



    {path: '/contas/cadastro', exact: true, component: Contas_Cadastro},
    {path: '/contas', exact: true, component: Contas},


    {path: '/boletos/cadastro/:id', exact: true, component: Boletos_Cadastro},
    {path: '/boletos/cadastro', exact: true, component: Boletos_Cadastro},
    {path: '/boletos', exact: true, component: Boletos},
    {path: '/boletos/:id', exact: true, component: Boletos_Detalhes},


    
    {path: '/proprietarios/cadastro', exact: true, component: Proprietarios_Cadastro},
    {path: '/proprietarios/cadastro/:id', exact: true, component: Proprietarios_Cadastro},
    {path: '/proprietarios', exact: true, component: Proprietarios},
    {path: '/proprietarios/:id', exact: true, component: Proprietarios_Detalhes},
    
    
    {path: '/apartamentos/cadastro', exact: true, component: Apartamentos_Cadastro},
    {path: '/apartamentos/cadastro/:id', exact: true, component: Apartamentos_Cadastro},
    {path: '/apartamentos', exact: true, component: Apartamentos},
    {path: '/apartamentos/:id', exact: true, component: Apartamentos_Detalhes},


    {path: '/usuarios/cadastro', exact: true, component: Usuarios_Cadastro},
    {path: '/usuarios/cadastro/:id', exact: true, component: Usuarios_Cadastro},
    {path: '/usuarios', exact: true, component: Usuarios},
    {path: '/usuarios/:id', exact: true, component: Usuarios_Detalhes},


    {path: '/permissoes/cadastro', exact: true, component: Permissoes_Cadastro},
    {path: '/permissoes/cadastro/:id', exact: true, component: Permissoes_Cadastro},
    {path: '/permissoes', exact: true, component: Permissoes},
    {path: '/permissoes/:id', exact: true, component: Permissoes_Detalhes},


    {path: '/avisos/cadastro', exact: true, component: Avisos_Cadastro},
    {path: '/avisos/cadastro/:id', exact: true, component: Avisos_Cadastro},
    {path: '/avisos', exact: true, component: Avisos},
    {path: '/avisos/:id', exact: true, component: Avisos_Detalhes},


    {path: '/contatos', exact: true, component: Contatos},
    {path: '/regras-e-normas', exact: true, component: RegrasNormas},
    {path: '/horario-de-funcionamento', exact: true, component: HorarioFuncionamento},
]


export const publicRoutes = [
    {path: '/login', exact: true, component: login},
    {path: '/criar-conta', exact: true, component: Register},
    {path: '/nao-autorizado', exact: true, component: Unauthorized},
    {path: '/nao-permitido', exact: true, component: NotAllowed},
    {path: '/404', exact: true, component: NotFound},
    {path: '/', exact: true, component: home},
];

