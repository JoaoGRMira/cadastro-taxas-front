import axios from 'axios';

const BASE_URL = 'https://temp-qingresso-taxas.onrender.com';

export const fetchData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/eventos`); 

    return response.data;
  } catch (error) {
    console.error('Erro ao obter os dados:', error);
    return null;
  }
};

export const fetchClasses = async (eve_cod) => {
  try {
    const response = await axios.post(`${BASE_URL}/classes`, {
      evento: eve_cod
    }); 

    return response.data;
  } catch (error) {
    console.error('Erro ao obter os dados:', error);
    return null;
  }
};
