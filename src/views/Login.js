import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/quero_ingresso_logo.png";
import Connection from "../model/index";
import { useToken } from "../model/tokenContext";
import "../Styles/login.css";
import { useLogin } from "../model/loginContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

export default function Login() {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({ login: "", senha: "" });
    const [error, setError] = useState("");
    const { setToken } = useToken();
    const { setLogin } = useLogin();

    localStorage.clear();

    // Identifica se os campos estão vazios
    const checkVazio = () => {
        let isVazio = false;
        if (document.getElementById("Login").value === "") {
            isVazio = true;
            return isVazio;
        }
        if (document.getElementById("Password").value === "") {
            isVazio = true;
            return isVazio;
        }
    };

    // Atualiza o estado do login
    const handleLoginChange = (event) => {
        setLoginData({ ...loginData, login: event.target.value });
    };

    // Atualiza o estado da senha
    const handlePasswordChange = (event) => {
        setLoginData({ ...loginData, senha: event.target.value });
    };

    // Envia a requisição de login
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Verifica se os campos estão vazios
        if (checkVazio()) {
            setError("Preencha suas credenciais.");
            return;
        }

        // Requisição de login
        try {
            const conn = Connection();
            const response = await conn.get(
                `/login?login=${loginData.login}&senha=${loginData.senha}`
            );
            if (response.status === 200) {
                setToken(response.data.token); // Armazena o token no contexto
                localStorage.setItem("token", response.data.token);
                setLogin(loginData.login); // Armazena o login no contexto
                localStorage.setItem("login", loginData.login);
                navigate("/cadastro-taxas");
            }
        } catch (error) {
            console.error("Erro durante a requisição:", error);
            setError("Credenciais inválidas");
        }
    };

    return (
        <div className="App">
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <form onSubmit={handleSubmit}> {/* Formulário de login */}
                        <img src={logo} alt="home" />

                        <div className="mb-3">
                            <input
                                type="text"
                                id="Login"
                                className="form-control"
                                placeholder="Login"
                                value={loginData.login}
                                onChange={handleLoginChange}
                            /> {/* Campo de login */}
                        </div>

                        <div className="mb-3">
                            <input
                                type="password"
                                id="Password"
                                className="form-control"
                                placeholder="Senha"
                                value={loginData.senha}
                                onChange={handlePasswordChange}
                            /> {/* Campo de senha */}
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">
                                Entrar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}