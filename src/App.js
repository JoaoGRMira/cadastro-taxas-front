import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "./components";
import * as Views from "./views";
import { LoginProvider } from "./model/loginContext";
import { TokenProvider } from "./model/tokenContext";

export default function App() {
    return (
        <>
            <LoginProvider> {/* Adiciona o LoginProvider */}
                <TokenProvider> {/* Adiciona o TokenProvider */}
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Views.Login />}></Route>
                            <Route path="/cadastro-taxas" element={<Sidebar />}>
                                <Route index element={<Views.CadastroTaxa />} />
                                {/* <Route path='/alocacao' element={<Views.AlocacaoEventoPdv/>}/> */}
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </TokenProvider>
            </LoginProvider>
        </>
    );
}