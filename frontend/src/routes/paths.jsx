import React, { Suspense, lazy } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Api } from "../contextApi/api"

// 1. Importações Normais (Carregam rápido no início)
import Home from "../pages/Home"
import Vaga from "../pages/Vaga"

// 2. Importações Preguiçosas (Só baixam quando o usuário entra na URL)
const Login = lazy(()=> import("../pages/Login"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const DashboardEdit = lazy(() => import("../pages/Dashboard-Edit"));
const PoliticaPrivacidade = lazy(() => import("../pages/rodape/PoliticaPrivacidade"));
const SobreNos = lazy(() => import("../pages/rodape/sobre"));
const TermosDeUso = lazy(() => import("../pages/rodape/TermosUso"));
const Contato = lazy(() => import("../pages/rodape/Contato"));

const Paths = () => {
    return (
        <HelmetProvider>
        <Api>
            <BrowserRouter>
                {/* 3. O Suspense segura a barra enquanto o arquivo JS pesado está baixando */}
                <Suspense fallback={
                    <div className="min-h-screen bg-gray-50 dark:bg-[#0b1120] flex flex-col items-center justify-center font-manrope">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                        <p className="text-gray-500 dark:text-gray-400 font-bold">Carregando painel...</p>
                    </div>
                }>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
                        <Route path="/sobre-nos" element={<SobreNos />} />
                        <Route path="/termos-de-uso" element={<TermosDeUso />} />
                        <Route path="/contato" element={<Contato />} />
                        <Route path="/vaga/:slug/:id" element={<Vaga />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/dashboard/editar" element={<DashboardEdit />} />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </Api>
        </HelmetProvider>
    );
}

export default Paths;