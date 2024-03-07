import axios from 'axios';

export default function Connection() {
    const url = process.env.REACT_APP_API_URL;
	//const url = 'http://localhost:3000/';

    const conn = axios.create({
        baseURL: url
    })

    return conn;
}

// VERSÃO 1.0.2
// DATA DE LIBERAÇÃO: 07/03/2024