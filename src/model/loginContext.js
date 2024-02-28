import React, { createContext, useContext, useState } from "react";

const LoginContext = createContext();

// Cria um contexto para o login
export function LoginProvider({ children }) {
    const [login, setLogin] = useState("");

    return (
      // O valor do contexto é um objeto com a propriedade login e a função setLogin
        <LoginContext.Provider value={{ login, setLogin }}>
            {children}
        </LoginContext.Provider>
    );
}

export function useLogin() {
    return useContext(LoginContext);
}