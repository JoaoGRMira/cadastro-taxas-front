import React, { createContext, useContext, useState } from "react";

const TokenContext = createContext();

// Cria um contexto para o token
export function TokenProvider({ children }) {
    const [token, setToken] = useState("");

    return (
      // O valor do contexto é um objeto com a propriedade token e a função setToken
        <TokenContext.Provider value={{ token, setToken }}>
            {children}
        </TokenContext.Provider>
    );
}

export function useToken() {
    return useContext(TokenContext);
}