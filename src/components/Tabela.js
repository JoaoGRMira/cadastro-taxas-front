import React, { useState } from 'react';
import './tabela.css';
import Checkbox from '@mui/material/Checkbox';
import { TableContainer } from '@mui/material';

const TableClasses = () => {
    const [tabelaData, setTabelaData] = useState([
        { id: 1, classe: 'CAMAROTE', vendas: 10, cortesia: 0, qtde: 10, valor: 'R$500,00'},
        { id: 2, classe: 'PISTA', vendas: 30, cortesia: 0, qtde: 30, valor: 'R$700,00'},
    ]);

    const [linhaSelecionada, setLinhaSelecionada] = useState(-1);

    const expandirLinha = (id) => {
        setTabelaData((prevData) =>
            prevData.map((item) => {
                if (item.id === id) {
                    return { ...item, expandir: !item.expandir };
                }
                return item;
            })
        );

        setLinhaSelecionada(id);
    };

    return (
        <TableContainer>
            <table className="classes-tabela">
                <thead>
                    <tr>
                        <th className="classes-cabecalho"></th>
                        <th className="classes-cabecalho">Classe</th>
                        <th className="classes-cabecalho">Vendas (Qtde)</th>
                        <th className="classes-cabecalho">Cortesia (Qtde)</th>
                        <th className="classes-cabecalho">Total (Qtde)</th>
                        <th className="classes-cabecalho">Valor</th>
                        <th className="classes-cabecalho">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {tabelaData.map((item, index) => (
                        <React.Fragment key={item.id}>
                            <tr
                                className={index % 2 === 0 ? 'classes-linha-branca' : 'classes-linha-cinza'}
                            >
                                <td className="classes-celula">
                                    <button
                                        className="classes-botao-expandir"
                                        onClick={() => expandirLinha(item.id)}
                                    >
                                        {item.expandir ? '-' : '+'}
                                    </button>
                                </td>
                                <td className="classes-celula">{item.classe}</td>
                                <td className="classes-celula">{item.vendas}</td>
                                <td className="classes-celula">{item.cortesia}</td>
                                <td className="classes-celula">{item.qtde}</td>
                                <td className="classes-celula">{item.valor}</td>
                                <td className="classes-celula">
                                    <Checkbox />
                                </td>
                            </tr>
                            {item.expandir && (
                                <>
                                    <tr>
                                        <td className="classes-linha-azul">Classe</td>
                                        <td className="classes-linha-azul">Valor</td>
                                        <td className="classes-linha-azul">Vendido</td>
                                        <td className="classes-linha-azul">Cortesia</td>
                                        <td className="classes-linha-azul">Total</td>
                                        <td className="classes-linha-azul">Valor Total</td>
                                        <td className="classes-linha-azul">
                                            <Checkbox />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="classes-conteudo-expandido">{item.classe}</td>
                                        <td className="classes-conteudo-expandido">{item.valor}</td>
                                        <td className="classes-conteudo-expandido">{item.vendas}</td>
                                        <td className="classes-conteudo-expandido">{item.cortesia}</td>
                                        <td className="classes-conteudo-expandido">{item.qtde}</td>
                                        <td className="classes-conteudo-expandido">{item.valor}</td>
                                        <td className="classes-conteudo-expandido">
                                            <Checkbox />
                                        </td>
                                    </tr>
                                </>
                            )}
                        </React.Fragment>
                    ))}
                    <tr>
                        <td className="classes-rodape"></td>
                        <td className="classes-rodape">Total (Vendas + Cortesia)</td>
                        <td className="classes-rodape">0</td>
                        <td className="classes-rodape">0</td>
                        <td className="classes-rodape">0</td>
                        <td className="classes-rodape">R$ 0,00</td>
                        <td className="classes-rodape"></td>
                    </tr>
                </tbody>
            </table>
        </TableContainer>

    );
};

export default TableClasses;