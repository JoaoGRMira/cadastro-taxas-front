import React, { useEffect, useMemo, useState } from "react";
import { DropdownList, NumberPercentMask } from "../components";
import Connection from "../model";
import {
    Box,
    Button,
    Checkbox,
    Container,
    Divider,
    FormControl,
    Grid,
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { styled } from "@mui/material/styles";
import { Delete } from "@mui/icons-material";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
const axios = Connection();

export default function CadastroTaxa() {
    //Estilos da célula da tabela
    const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.white,
            color: theme.palette.common.black,
            fontSize: 15,
            "&:nth-of-type(1)": {
                minWidth: "100px",
            },
            "&:nth-of-type(2)": {
                minWidth: "100px",
            },
            "&:nth-of-type(3)": {
                minWidth: "200px",
            },
            "&:nth-of-type(4)": {
                minWidth: "150px",
            },
            "&:nth-of-type(5)": {
                minWidth: "50px",
            },
            "&:nth-of-type(6)": {
                minWidth: "150px",
            },
            "&:nth-of-type(7)": {
                minWidth: "50px",
            },
            "&:nth-of-type(8)": {
                minWidth: "150px",
            },
            "&:nth-of-type(9)": {
                minWidth: "50px",
            },
            "&:nth-of-type(10)": {
                minWidth: "150px",
            },
            "&:nth-of-type(11)": {
                minWidth: "50px",
            },
            "&:nth-of-type(12)": {
                minWidth: "150px",
            },
            "&:nth-of-type(13)": {
                minWidth: "150px",
            },
            "&:nth-of-type(14)": {
                minWidth: "50px",
            },
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 15,
            padding: 11,
        },
        borderBottom: "1px solid var(--grey-shadow)",
    }));

    //Estilos da linha da tabela
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        "&:nth-of-type(odd)": {
            backgroundColor: "var(--grey-shadow)",
        },
        "&:nth-of-type(even)": {
            backgroundColor: "white",
        },
        "&:last-child td, &:last-child th": {
            borderBottom: "1px solid var(--grey-shadow)",
            color: "var(--grey)",
            fontWeight: "bold",
            fontFamily: '"Century Gothic", Futura, sans-serif',
            backgroundColor: "white",
        },
    }));

    const [loading, setLoading] = useState(false); // Estado para controlar o loading da requisição
    const [classe_loading, setClasseLoading] = useState(false); // Estado para controlar o loading das classes
    const [evento, setEvento] = useState(null); // Estado para controlar o evento selecionado
    const [eventosList, setEventosList] = useState([]); // Estado para armazenar a lista de eventos
    const [classesList, setClassesList] = useState([]); // Estado para armazenar a lista de classes
    const [parcelaOpcao, setParcelaOpcao] = useState([]); // Estado para armazenar a opção de parcela selecionada
    const [parcelasList, setParcelasList] = useState([]); // Estado para armazenar a lista de parcelas
    const [taxaParcelasList, setTaxaParcelasList] = useState([]); // Estado para armazenar a lista de taxas de parcelas

    const [taxaParcelasValor, setTaxaParcelasValor] = useState("0.00"); // Estado para controlar o valor da taxa de parcelas
    const [taxaParcelasPerc, setTaxaParcelasPerc] = useState("0"); // Estado para controlar a porcentagem da taxa de parcelas

    const [taxaPadrao, setTaxaPadrao] = useState("0.00"); // Estado para controlar a taxa padrão
    const [taxaParcelas, setTaxaParcelas] = useState("0.00"); // Estado para controlar a taxa parcelas

    const [valorMinParcela, setValorMinParcela] = useState("0.00"); // Estado para controlar o valor mínimo da parcela
    const [numMaxParcelas, setNumMaxParcelas] = useState("0"); // Estado para controlar o número máximo de parcelas

    const [dinheiro, setDinheiro] = useState("0.00"); // Estado para controlar o valor da taxa de dinheiro
    const [dinheiro_perc, setDinheiro_perc] = useState(0); // Estado para controlar a porcentagem da taxa de dinheiro

    const [credito, setCredito] = useState("0.00"); // Estado para controlar o valor da taxa de crédito
    const [credito_perc, setCredito_perc] = useState(0); // Estado para controlar a porcentagem da taxa de crédito

    const [debito, setDebito] = useState("0.00"); // Estado para controlar o valor da taxa de débito
    const [debito_perc, setDebito_perc] = useState(0); // Estado para controlar a porcentagem da taxa de débito

    const [pix, setPix] = useState("0.00"); // Estado para controlar o valor da taxa de PIX
    const [pix_perc, setPix_perc] = useState(0); // Estado para controlar a porcentagem da taxa de PIX

    const [parcelaMax, setParcelaMax] = useState(1); // Estado para controlar o número máximo de parcelas

    const [parcela, setParcela] = useState("0.00"); // Estado para controlar o valor da taxa de parcela
    const [parcela_perc, setParcela_perc] = useState(0); // Estado para controlar a porcentagem da taxa de parcela

    const [selectedOption, setSelectedOption] = useState("cancelar"); // Estado para controlar a opção de senha selecionada
    const [senha, setSenha] = useState(null); // Estado para controlar a opção de senha selecionada

    //Função para controlar a opção de senha selecionada
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    // Função para controlar o tipo de parcela selecionado (R$ ou %)
    const handleCheckboxTaxaParcelaChange = (event) => {
        // Verifica se o checkbox está marcado
        const isChecked = event.target.checked;

        // Atualiza a variável taxaParcelasPerc com base no estado do checkbox
        setTaxaParcelasPerc(isChecked ? 1 : 0);
    };

    // Função para substituir vírgulas por pontos
const substituirVirgulasPorPontos = (numero) => {
    if (typeof numero === 'string') {
        return numero.replace(',', '.');
    }
    return numero;
};

    const limite_parcelas = useMemo(() => {
        if (classesList.length > 0) {
            let limits = classesList.map((classe) => {
                return Math.floor(parseFloat(classe.value.cla_valor));
            });

            return limits.reduce((prev, next) => {
                if (prev > next) prev = next;
                return prev;
            });
        }

        return 1;
    }, [classesList]);

    /**
     * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e
     */
    // Salva as taxas, parcelas e taxa padrão de um evento e suas classes de ingressos.
    function saveTaxa(e) {
        e.preventDefault();

        setLoading(true);
        axios
            .post(
                `save/taxa`,
                {
                    evento: evento.value,
                    classes: classesList.map((a) => a.value),
                },
                {
                    headers: {
                        token: localStorage.getItem("token"),
                    },
                }
            )
            .then((resp) => {
                if (resp.data) {
                    alert("Sobretaxa Salva");
                }
            })
            .finally(() => setLoading(false));
    }

    /**
     * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e
     */
    //Registra uma nova parcela.
    const criarRegraParcela = async (dadosRegraParcela) => {
        try {
            const response = await axios.post("/parcela", dadosRegraParcela, {
                headers: {
                    token: localStorage.getItem("token"),
                },
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao criar regra de parcela:", error);
            throw error;
        }
    };

    //Cria uma nova taxa de parcela.
    const criarTaxaParcela = async (dadosTaxaParcela) => {
        try {
            //console.log("Dados enviados para a criação da taxa de parcela:");

            const response = await axios.post(
                "/parcela/taxa",
                {
                    valor: dadosTaxaParcela.txp_valor,
                    perc: dadosTaxaParcela.txp_perc,
                },
                {
                    headers: {
                        token: localStorage.getItem("token"),
                    },
                }
            );

            //console.log("Resposta do servidor:", response.data);

            return response.data;
        } catch (error) {
            console.error(
                "Erro ao criar taxa de parcela:",
                error.response ? error.response.data : error.message
            );
            throw error;
        }
    };

    //console.log(taxaParcelasPerc);
    //console.log(taxaParcelasValor);

    //Atualiza uma parcela.
    const atualizarRegraParcela = async (editarRegraParcela) => {
        try {
            const response = await axios.put("/parcela", editarRegraParcela, {
                headers: {
                    token: localStorage.getItem("token"),
                },
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao atualizar regra de parcela:", error);
            throw error;
        }
    };

    //Deleta uma parcela pelo id informado.
    const deletarRegraParcela = async (idRegraParcela) => {
        try {
            const response = await axios.delete(
                `/parcela?id=${idRegraParcela}`,
                {
                    headers: {
                        token: localStorage.getItem("token"),
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Erro ao deletar regra de parcela:", error);
            throw error;
        }
    };

    //Gera uma senha de uso único.
    const genPass = async (radioOption) => {
        try {
            const response = await axios.get(`/gen_pass?tipo=${radioOption}`, {
                headers: {
                    token: localStorage.getItem("token"),
                },
            });
            setSenha(response.data.senha);
            return senha;
        } catch (error) {
            console.error("Erro ao gerar senha:", error);
            throw error;
        }
    };

    /**
     * @param {number} evento
     */
    //Retorna as classes de ingressos do evento informado.
    function getClasses(evento) {
        setClasseLoading(true);
        axios
            .post(
                "classes",
                {
                    evento,
                },
                {
                    headers: {
                        token: localStorage.getItem("token"),
                    },
                }
            )
            .then((resp) => {
                setClassesList(
                    resp.data.map((a) => ({
                        value: a,
                        label: a.cla_nome,
                    }))
                );
            })
            .finally(() => setClasseLoading(false));
    }
    //console.log(classesList)

    /**
     * @param {string} local
     * @param {string} prop
     * @param {string|number} valor
     */
    function updateAllTax(local, prop, valor) {
        classesList.map((classe) =>
            classe.value.pdvs.map((pdv) => {
                pdv[local][prop] = valor;
                return pdv;
            })
        );
    }

    //Retorna a lista dos eventos ativos.
    useEffect(() => {
        let execute = true;

        axios
            .get("eventos", {
                headers: {
                    token: localStorage.getItem("token"),
                },
            })
            .then((resp) => {
                if (!eventosList.length && execute) {
                    setEventosList(
                        resp.data.map((a) => ({
                            value: a,
                            label: a.eve_nome,
                        }))
                    );
                }
            })
            .catch((error) => {
                // Identifica se houve erro na requisição e redireciona para a página de login caso o erro seja 401
                console.error(error);
                if (error.response && error.response.status === 401) {
                    // Redireciona para a página de login
                    window.location.href = "/";
                }
            });

        return () => {
            execute = false;
        };
    }, [eventosList]);
    //console.log(eventosList)

    //Retorna as taxas de parcelas registradas.
    useEffect(() => {
        let execute = true;

        if (!taxaParcelasList.length && execute) {
            axios
                .get("/parcela/taxa", {
                    headers: {
                        token: localStorage.getItem("token"),
                    },
                })
                .then((resp) => {
                    if (execute) {
                        setTaxaParcelasList(resp.data);
                        setTaxaParcelasPerc(resp.data.txp_perc);
                        setTaxaParcelasValor(resp.data.txp_valor);
                    }
                });
        }

        return () => {
            execute = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    //console.log(taxaParcelasList);

    //Retorna as regras de parcelamento registradas.
    useEffect(() => {
        let execute = true;
        //Consulta os dados de parcela e armazena no useState
        axios
            .get("parcela", {
                headers: {
                    token: localStorage.getItem("token"),
                },
            })
            .then((resp) => {
                if (!parcelasList.length && execute) {
                    setParcelasList(
                        resp.data.map((a) => ({
                            value: a,
                            label: a.par_valor_min,
                        }))
                    );
                }
            });

        return () => {
            execute = false;
        };
    }, [parcelasList]);
    //console.log(parcelasList)

    /**
     * @param {{
     * 	taxa: string,
     * 	setTaxa: React.Dispatch<React.SetStateAction<string>>,
     * 	onChange: (value: string) => void,
     * 	percent: 0|1,
     * 	setPercent: React.Dispatch<React.SetStateAction<0|1>>,
     * 	onCheck: (perc: string) => void
     * }}
     * @returns
     */
    function TaxaInput({
        taxa,
        setTaxa,
        onChange,
        percent,
        setPercent,
        onCheck,
    }) {
        return (
            <>
                {/* Taxa */}
                <TableCell align="center">
                    <TextField
                        label="Valor"
                        variant="outlined"
                        value={percent ? `${taxa} %` : `R$ ${taxa}`}
                        onChange={(a) => {
                            let value = a.target.value;

                            setTaxa(value);
                            onChange(value);
                        }}
                    />
                </TableCell>
                {/* % */}
                <TableCell align="center">
                    <Checkbox
                        checked={percent}
                        onChange={() => {
                            let perc = !percent ? 1 : 0;

                            setPercent(perc);
                            onCheck(perc);
                        }}
                    />
                </TableCell>
            </>
        );
    }

    /**
     * @param {{
     * 	pdv: {
     * 		pdv_id: number,
     * 		pdv_nome: string,
     * 		taxa: {
     * 			tax_id: number,
     * 			tax_classe: number,
     * 			tax_dinheiro: string,
     * 			tax_dinheiro_perc: 0|1,
     * 			tax_credito: string,
     * 			tax_credito_perc: 0|1,
     * 			tax_debito: string,
     * 			tax_debito_perc: 0|1,
     * 			tax_pix: string,
     * 			tax_pix_perc: 0|1,
     * 			tax_pdv: number
     * 		},
     * 		"parcela": {
     *			par_id: number,
     *			par_mpgto: number,
     *			par_pdv: number,
     *			par_classe: number
     *		}
     * 	},
     * 	valor_ing: number,
     * 	show: boolean
     * }}
     * @returns
     */
    function TaxaFragment({ pdv, valor_ing, show }) {
        const [dinheiro, setDinheiro] = useState(pdv.taxa.tax_dinheiro);
        const [dinheiro_perc, setDinheiro_perc] = useState(
            pdv.taxa.tax_dinheiro_perc
        );

        const [credito, setCredito] = useState(pdv.taxa.tax_credito);
        const [credito_perc, setCredito_perc] = useState(
            pdv.taxa.tax_credito_perc
        );

        const [debito, setDebito] = useState(pdv.taxa.tax_debito);
        const [debito_perc, setDebito_perc] = useState(
            pdv.taxa.tax_debito_perc
        );

        const [pix, setPix] = useState(pdv.taxa.tax_pix);
        const [pix_perc, setPix_perc] = useState(pdv.taxa.tax_pix_perc);

        const limite_parcelas = Math.floor(valor_ing);

        return (
            <TableRow className={show ? "" : "collapsed"}>
                {/* PDV */}
                <TableCell
                    align="center"
                    sx={{ borderLeft: "1px solid var(--grey-shadow)" }}
                >
                    {pdv.pdv_nome}
                </TableCell>

                {/* Dinheiro */}
                <TaxaInput
                    taxa={dinheiro}
                    setTaxa={setDinheiro}
                    onChange={(value) => (pdv.taxa.tax_dinheiro = value)}
                    percent={dinheiro_perc}
                    setPercent={setDinheiro_perc}
                    onCheck={(perc) => (pdv.taxa.tax_dinheiro_perc = perc)}
                />

                {/* Crédito */}
                <TaxaInput
                    taxa={credito}
                    setTaxa={setCredito}
                    onChange={(value) => (pdv.taxa.tax_credito = value)}
                    percent={credito_perc}
                    setPercent={setCredito_perc}
                    onCheck={(perc) => (pdv.taxa.tax_credito_perc = perc)}
                />

                {/* Débito */}
                <TaxaInput
                    taxa={debito}
                    setTaxa={setDebito}
                    onChange={(value) => (pdv.taxa.tax_debito = value)}
                    percent={debito_perc}
                    setPercent={setDebito_perc}
                    onCheck={(perc) => (pdv.taxa.tax_debito_perc = perc)}
                />

                {/* PIX */}
                <TaxaInput
                    taxa={pix}
                    setTaxa={setPix}
                    onChange={(value) => (pdv.taxa.tax_pix = value)}
                    percent={pix_perc}
                    setPercent={setPix_perc}
                    onCheck={(perc) => (pdv.taxa.tax_pix_perc = perc)}
                />
            </TableRow>
        );
    }

    /**
     * @param {{
     * 	classe: {
     * 		label: string,
     * 		value: {
     * 			cla_cod: number,
     * 			cla_nome: string,
     * 			cla_valor: string,
     * 			pdvs: {}[]
     * 		}
     * 	}
     * }}
     * @returns
     */
    function ClasseFragment({ classe }) {
        // eslint-disable-next-line no-unused-vars
        const [collapsed, setCollapsed] = useState(true);

        let rowSpan = collapsed ? Object.keys(classe.value.pdvs).length + 1 : 1;

        return (
            <>
                <TableRow className="classe">
                    <TableCell rowSpan={rowSpan} align="center">
                        <div>
                            <p>{classe.label}</p>
                        </div>
                    </TableCell>
                    <TableCell rowSpan={rowSpan} align="center">
                        <p>R$ {classe.value.cla_valor}</p>
                    </TableCell>
                </TableRow>
                {classe.value.pdvs.map((pdv, index) => (
                    <TaxaFragment
                        key={index}
                        pdv={pdv}
                        valor_ing={parseFloat(classe.value.cla_valor)}
                        show={collapsed}
                    />
                ))}
                <TableRow className="table-separator" />
            </>
        );
    }

    // console.log(selectedOption)
    // console.log(parcelaOpcao)
    // console.log(parcelaOpcao.value.par_id)
    // console.log(numMaxParcelas)
    // console.log(valorMinParcela)
    return (
        <>
            <Box sx={{ display: "flex" }}>
                <Container maxWidth="xl" sx={{ mt: 4 }}>
                    <Grid container spacing={3}>
                        {/* Área de Sobretaxa */}
                        <Grid item xs={12} md={12} lg={12}>
                            <Paper sx={{ p: 2 }}>
                                <Typography
                                    variant="h5"
                                    component="div"
                                    align="center"
                                    sx={{
                                        paddingTop: 2,
                                        px: 2,
                                        fontFamily:
                                            '"Century Gothic", Futura, sans-serif',
                                        fontWeight: "bold",
                                    }}
                                    gutterBottom
                                >
                                    Sobretaxa de Ingresso
                                </Typography>
                                <Divider
                                    sx={{
                                        my: 2,
                                        mx: 20,
                                        backgroundColor: "var(--blue)",
                                    }}
                                />
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={4} lg={4}>
                                        <Typography
                                            variant="body"
                                            component="div"
                                            sx={{
                                                padding: 2,
                                                pb: 2,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            <CalendarTodayIcon
                                                sx={{
                                                    color: "var(--blue)",
                                                    marginRight: 1,
                                                    marginBottom: -0.5,
                                                }}
                                            />
                                            Evento:
                                        </Typography>
                                        {/* dropdown seleção de evento */}
                                        <FormControl
                                            sx={{ width: "100%", height: 50 }}
                                        >
                                            <DropdownList
                                                data={eventosList}
                                                value={evento}
                                                placeholder={
                                                    "Selecionar Evento..."
                                                }
                                                disabled={!eventosList.length}
                                                onChangeHandler={(evento) => {
                                                    setEvento(evento);

                                                    if (evento !== null) {
                                                        getClasses(
                                                            evento?.value
                                                                .eve_cod
                                                        );
                                                        setTaxaPadrao(
                                                                evento?.value
                                                                    .eve_taxa_valor
                                                        );
                                                        setTaxaParcelas(
                                                            taxaParcelasList.txp_valor,
                                                            0
                                                        );
                                                    } else {
                                                        setClassesList([]);
                                                        setTaxaPadrao("0,00");
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={3} lg={3}>
                                        <Typography
                                            variant="body"
                                            component="div"
                                            sx={{
                                                padding: 2.5,
                                                pb: 2,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            <LocalActivityIcon
                                                sx={{
                                                    color: "var(--blue)",
                                                    marginRight: 1,
                                                    marginBottom: -1,
                                                }}
                                            />
                                            Taxa Padrão:
                                        </Typography>
                                        {/* campo de taxa padrão */}
                                        <TextField
                                            id="outlined-basic"
                                            label="R$"
                                            variant="outlined"
                                            style={{
                                                width: "100%",
                                                height: 50,
                                            }}
                                            InputLabelProps={{ shrink: true }}
                                            value={taxaPadrao}
                                            onChange={(a) => {
                                                let value = 
                                                    a.target.value
                                                setTaxaPadrao(value);
                                                evento.value.eve_taxa_valor =
                                                    value;
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={10} md={3} lg={3}>
                                        <Typography
                                            variant="body"
                                            component="div"
                                            sx={{
                                                padding: 2.5,
                                                pb: 2,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            <ConfirmationNumberIcon
                                                sx={{
                                                    color: "var(--blue)",
                                                    marginRight: 1,
                                                    marginBottom: -1,
                                                }}
                                            />
                                            Taxa por Parcelas:
                                        </Typography>
                                        {/* campo de taxa por parcela */}
                                        <TextField
                                            id="outlined-basic"
                                            label={
                                                taxaParcelasPerc === 1
                                                    ? "%"
                                                    : "R$"
                                            }
                                            variant="outlined"
                                            style={{
                                                width: "100%",
                                                height: 50,
                                            }}
                                            InputLabelProps={{ shrink: true }}
                                            value={taxaParcelas}
                                            onChange={(a) => {
                                                let value = a.target.value;
                                                setTaxaParcelas(value);
                                                taxaParcelasList.txp_valor =
                                                    value;
                                                setTaxaParcelasValor(value);
                                            }}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={2}
                                        md={2}
                                        lg={2}
                                        sx={{
                                            alignContent: "center",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            textAlign: "center",
                                        }}
                                    >
                                        <Typography
                                            variant="body"
                                            component="div"
                                            sx={{
                                                padding: 2.5,
                                                pb: 2,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Taxa em percentual
                                        </Typography>
                                        <Checkbox
                                            onChange={
                                                handleCheckboxTaxaParcelaChange
                                            }
                                            checked={taxaParcelasPerc === 1}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sx={{ textAlign: "center" }}
                                    >
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            disabled={loading || !evento}
                                            onClick={(e) => {
                                                const dadosTaxaParcela = {
                                                    txp_valor:
                                                    substituirVirgulasPorPontos(taxaParcelasValor),
                                                    txp_perc: taxaParcelasPerc,
                                                };
                                                criarTaxaParcela(
                                                    dadosTaxaParcela
                                                );
                                                saveTaxa(substituirVirgulasPorPontos(e));
                                            }}
                                            sx={{ mt: 2, width: 100 }}
                                        >
                                            {loading ? "Salvando..." : "Salvar"}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        {/* Tabela de Taxas */}
                        <Grid item xs={12} md={12} lg={12}>
                            <Paper sx={{ mb: 3 }}>
                                <TableContainer>
                                    <Typography
                                        variant="h6"
                                        component="div"
                                        sx={{
                                            padding: 2,
                                            fontFamily:
                                                '"Century Gothic", Futura, sans-serif',
                                            fontWeight: "bold",
                                            color: "var(--blue)",
                                        }}
                                    >
                                        <EventAvailableIcon
                                            sx={{
                                                color: "var(--blue)",
                                                marginRight: 1,
                                                marginBottom: -0.5,
                                            }}
                                        />
                                        Taxas do Evento
                                    </Typography>
                                    <Table aria-label="customized table">
                                        <TableHead>
                                            {/* header da tabela de taxas */}
                                            <StyledTableRow>
                                                <StyledTableHeaderCell align="center">
                                                    Classes
                                                </StyledTableHeaderCell>
                                                <StyledTableHeaderCell align="center">
                                                    Valor Ingresso
                                                </StyledTableHeaderCell>
                                                <StyledTableHeaderCell align="center">
                                                    PDV
                                                </StyledTableHeaderCell>
                                                <StyledTableHeaderCell align="center">
                                                    Dinheiro
                                                </StyledTableHeaderCell>
                                                <StyledTableHeaderCell align="center">
                                                    %
                                                </StyledTableHeaderCell>
                                                <StyledTableHeaderCell align="center">
                                                    Crédito
                                                </StyledTableHeaderCell>
                                                <StyledTableHeaderCell align="center">
                                                    %
                                                </StyledTableHeaderCell>
                                                <StyledTableHeaderCell align="center">
                                                    Débito
                                                </StyledTableHeaderCell>
                                                <StyledTableHeaderCell align="center">
                                                    %
                                                </StyledTableHeaderCell>
                                                <StyledTableHeaderCell align="center">
                                                    PIX
                                                </StyledTableHeaderCell>
                                                <StyledTableHeaderCell align="center">
                                                    %
                                                </StyledTableHeaderCell>
                                            </StyledTableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell colSpan="3" />
                                                {/* Dinheiro */}
                                                <TableCell align="center">
                                                    <TextField
                                                        label="Valor"
                                                        variant="outlined"
                                                        value={
                                                            dinheiro_perc
                                                                ? `${dinheiro} %`
                                                                : `R$ ${dinheiro}`
                                                        }
                                                        onChange={(a) => {
                                                            let value =
                                                                    a.target
                                                                        .value
                                                                

                                                            setDinheiro(value);
                                                            updateAllTax(
                                                                "taxa",
                                                                "tax_dinheiro",
                                                                value
                                                            );
                                                        }}
                                                    />
                                                </TableCell>
                                                {/* % */}
                                                <TableCell align="center">
                                                    <Checkbox
                                                        checked={dinheiro_perc}
                                                        onChange={() => {
                                                            let perc =
                                                                !dinheiro_perc
                                                                    ? 1
                                                                    : 0;

                                                            setDinheiro_perc(
                                                                perc
                                                            );
                                                            updateAllTax(
                                                                "taxa",
                                                                "tax_dinheiro_perc",
                                                                perc
                                                            );
                                                        }}
                                                    />
                                                </TableCell>
                                                {/* Crédito */}
                                                <TableCell align="center">
                                                    <TextField
                                                        label="Valor"
                                                        variant="outlined"
                                                        value={
                                                            credito_perc
                                                                ? `${credito} %`
                                                                : `R$ ${credito}`
                                                        }
                                                        onChange={(a) => {
                                                            let value =
                                                                    a.target
                                                                        .value

                                                            setCredito(value);
                                                            updateAllTax(
                                                                "taxa",
                                                                "tax_credito",
                                                                value
                                                            );
                                                        }}
                                                    />
                                                </TableCell>
                                                {/* % */}
                                                <TableCell align="center">
                                                    <Checkbox
                                                        checked={credito_perc}
                                                        onChange={() => {
                                                            let perc =
                                                                !credito_perc
                                                                    ? 1
                                                                    : 0;

                                                            setCredito_perc(
                                                                perc
                                                            );
                                                            updateAllTax(
                                                                "taxa",
                                                                "tax_credito_perc",
                                                                perc
                                                            );
                                                        }}
                                                    />
                                                </TableCell>
                                                {/* Débito */}
                                                <TableCell align="center">
                                                    <TextField
                                                        label="Valor"
                                                        variant="outlined"
                                                        value={
                                                            debito_perc
                                                                ? `${debito} %`
                                                                : `R$ ${debito}`
                                                        }
                                                        onChange={(a) => {
                                                            let value =
                                                                    a.target
                                                                        .value

                                                            setDebito(value);
                                                            updateAllTax(
                                                                "taxa",
                                                                "tax_debito",
                                                                value
                                                            );
                                                        }}
                                                    />
                                                </TableCell>
                                                {/* % */}
                                                <TableCell align="center">
                                                    <Checkbox
                                                        checked={debito_perc}
                                                        onChange={() => {
                                                            let perc =
                                                                !debito_perc
                                                                    ? 1
                                                                    : 0;

                                                            setDebito_perc(
                                                                perc
                                                            );
                                                            updateAllTax(
                                                                "taxa",
                                                                "tax_debito_perc",
                                                                perc
                                                            );
                                                        }}
                                                    />
                                                </TableCell>
                                                {/* PIX */}
                                                <TableCell align="center">
                                                    <TextField
                                                        label="Valor"
                                                        variant="outlined"
                                                        value={
                                                            pix_perc
                                                                ? `${pix} %`
                                                                : `R$ ${pix}`
                                                        }
                                                        onChange={(a) => {
                                                            let value =
                                                                    a.target
                                                                        .value

                                                            setPix(value);
                                                            updateAllTax(
                                                                "taxa",
                                                                "tax_pix",
                                                                value
                                                            );
                                                        }}
                                                    />
                                                </TableCell>
                                                {/* % */}
                                                <TableCell align="center">
                                                    <Checkbox
                                                        checked={pix_perc}
                                                        onChange={() => {
                                                            let perc = !pix_perc
                                                                ? 1
                                                                : 0;

                                                            setPix_perc(perc);
                                                            updateAllTax(
                                                                "taxa",
                                                                "tax_pix_perc",
                                                                perc
                                                            );
                                                        }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                            <tr className="table-separator" />
                                            {!!classesList.length &&
                                                classesList.map(
                                                    (classe, index) => {
                                                        return (
                                                            <ClasseFragment
                                                                key={index}
                                                                classe={classe}
                                                            />
                                                        );
                                                    }
                                                )}
                                            {!!evento &&
                                                classesList.length === 0 &&
                                                !classe_loading && (
                                                    <tr>
                                                        <th colSpan={13}>
                                                            Sem ingressos
                                                            alocados
                                                        </th>
                                                    </tr>
                                                )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                        {/* Área de Regras de Parcelas*/}
                        <Grid item xs={12} md={12} lg={12}>
                            <Paper sx={{ p: 2 }}>
                                <Typography
                                    variant="h5"
                                    component="div"
                                    align="center"
                                    sx={{
                                        paddingTop: 2,
                                        px: 2,
                                        fontFamily:
                                            '"Century Gothic", Futura, sans-serif',
                                        fontWeight: "bold",
                                    }}
                                    gutterBottom
                                >
                                    Regras de Parcelas
                                </Typography>
                                <Divider
                                    sx={{
                                        my: 2,
                                        mx: 20,
                                        backgroundColor: "var(--blue)",
                                    }}
                                />
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6} lg={6}>
                                        <Typography
                                            variant="body"
                                            component="div"
                                            sx={{
                                                padding: 2.5,
                                                pb: 2,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            <LocalActivityIcon
                                                sx={{
                                                    color: "var(--blue)",
                                                    marginRight: 1,
                                                    marginBottom: -1,
                                                }}
                                            />
                                            Valor Mínimo:
                                        </Typography>
                                        {/* campo de valor mínimo por parcela */}
                                        <TextField
                                            id="outlined-basic"
                                            variant="outlined"
                                            style={{
                                                width: "100%",
                                                height: 50,
                                            }}
                                            InputLabelProps={{ shrink: true }}
                                            //(parcelaOpcao.value && parcelaOpcao.value.par_valor_min) ||
                                            value={
                                                (parcelaOpcao.value &&
                                                    parcelaOpcao.value
                                                        .par_valor_min) ||
                                                valorMinParcela
                                            }
                                            onChange={(a) => {
                                                let value = a.target.value;
                                                setValorMinParcela(value);
                                                if (parcelaOpcao.value) {
                                                    parcelaOpcao.value.par_valor_min =
                                                        value;
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={6}>
                                        <Typography
                                            variant="body"
                                            component="div"
                                            sx={{
                                                padding: 2.5,
                                                pb: 2,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            <LocalActivityIcon
                                                sx={{
                                                    color: "var(--blue)",
                                                    marginRight: 1,
                                                    marginBottom: -1,
                                                }}
                                            />
                                            Máximo de Parcelas:
                                        </Typography>
                                        {/* campo de máximo de parcelas permitidas */}
                                        <TextField
                                            id="outlined-basic"
                                            variant="outlined"
                                            style={{
                                                width: "100%",
                                                height: 50,
                                            }}
                                            InputLabelProps={{ shrink: true }}
                                            //(parcelaOpcao.value && parcelaOpcao.value.par_count) ||
                                            value={
                                                (parcelaOpcao.value &&
                                                    parcelaOpcao.value
                                                        .par_count) ||
                                                numMaxParcelas
                                            }
                                            onChange={(a) => {
                                                let value = a.target.value;
                                                setNumMaxParcelas(value);
                                                if (parcelaOpcao.value) {
                                                    parcelaOpcao.value.par_count =
                                                        value;
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sx={{ textAlign: "center" }}
                                    >
                                        {/* botão de salvar parcela */}
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            //disabled={loading || !parcelaOpcao}
                                            onClick={() => {
                                                const dadosRegraParcela = {
                                                    par_valor_min:
                                                    substituirVirgulasPorPontos(valorMinParcela),
                                                    par_count: numMaxParcelas,
                                                };
                                                criarRegraParcela(
                                                    dadosRegraParcela
                                                )
                                                    .then((resposta) => {
                                                        // console.log(
                                                        //     "Regra de parcela criada:",
                                                        //     resposta
                                                        // );
                                                        window.location.reload();
                                                    })
                                                    .catch((erro) => {
                                                        console.error(
                                                            "Erro ao criar regra de parcela:",
                                                            erro
                                                        );
                                                    });
                                                //console.log(dadosRegraParcela);
                                            }}
                                            sx={{ m: 2, width: 100 }}
                                        >
                                            {/*{loading ? 'Salvando...' : 'Salvar'}*/}{" "}
                                            Criar
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={12}>
                                        <Typography
                                            variant="body"
                                            component="div"
                                            sx={{
                                                px: 2,
                                                pb: 2,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            <CalendarTodayIcon
                                                sx={{
                                                    color: "var(--blue)",
                                                    marginRight: 1,
                                                    marginBottom: -0.5,
                                                }}
                                            />
                                            Parcelas:
                                        </Typography>
                                        <FormControl
                                            sx={{
                                                width: "100%",
                                                height: 50,
                                                marginBottom: 5,
                                            }}
                                        >
                                            {/* dropdown seleção de parcelas existentes */}
                                            <DropdownList
                                                data={parcelasList}
                                                value={parcelaOpcao}
                                                placeholder={
                                                    "Selecionar Parcela..."
                                                }
                                                disabled={!parcelasList.length}
                                                onChangeHandler={(
                                                    parcelaOpcao
                                                ) => {
                                                    setParcelaOpcao(
                                                        parcelaOpcao
                                                    );
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sx={{ textAlign: "center" }}
                                    >
                                        {/* botão de editar parcela */}
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            //disabled={loading || !parcelaOpcao}
                                            onClick={() => {
                                                const editarRegraParcela = {
                                                    par_id: parcelaOpcao.value
                                                        .par_id,
                                                    par_valor_min:
                                                    substituirVirgulasPorPontos(valorMinParcela),
                                                    par_count: numMaxParcelas,
                                                };
                                                atualizarRegraParcela(
                                                    editarRegraParcela
                                                )
                                                    .then((resposta) => {
                                                        // console.log(
                                                        //     "Regra de parcela atualizada:",
                                                        //     resposta
                                                        // );
                                                        window.location.reload();
                                                    })
                                                    .catch((erro) => {
                                                        console.error(
                                                            "Erro ao atualizar regra de parcela:",
                                                            erro
                                                        );
                                                    });
                                                //console.log(editarRegraParcela);
                                            }}
                                            sx={{ m: 2, width: 100 }}
                                        >
                                            {/*{loading ? 'Salvando...' : 'Salvar'}*/}{" "}
                                            Editar
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        {/* Tabela de Regras de Parcelas */}
                        <Grid item xs={12} md={12} lg={12}>
                            <Paper sx={{ mb: 3 }}>
                                <TableContainer>
                                    <Typography
                                        variant="h6"
                                        component="div"
                                        sx={{
                                            padding: 2,
                                            fontFamily:
                                                '"Century Gothic", Futura, sans-serif',
                                            fontWeight: "bold",
                                            color: "var(--blue)",
                                        }}
                                    >
                                        <EventAvailableIcon
                                            sx={{
                                                color: "var(--blue)",
                                                marginRight: 1,
                                                marginBottom: -0.5,
                                            }}
                                        />
                                        Regras de Parcela
                                    </Typography>
                                    <Table aria-label="customized table">
                                        <TableHead>
                                            {/* header da tabela de taxas */}
                                            <StyledTableRow>
                                                <StyledTableHeaderCell align="center">
                                                    ID da Regra
                                                </StyledTableHeaderCell>
                                                <StyledTableHeaderCell align="center">
                                                    Valor Mínimo
                                                </StyledTableHeaderCell>
                                                <StyledTableHeaderCell align="center">
                                                    Quantidade de Parcelas
                                                </StyledTableHeaderCell>
                                                {/*<StyledTableHeaderCell align="center">Editar</StyledTableHeaderCell>*/}
                                                <StyledTableHeaderCell align="center">
                                                    Excluir
                                                </StyledTableHeaderCell>
                                            </StyledTableRow>
                                        </TableHead>
                                        <TableBody>
                                            {parcelasList.map(
                                                (parcela, index) => (
                                                    <TableRow key={index}>
                                                        {/* ID da Regra */}
                                                        <TableCell align="center">
                                                            <TextField
                                                                label="ID"
                                                                variant="outlined"
                                                                disabled
                                                                value={
                                                                    parcela
                                                                        .value
                                                                        .par_id
                                                                }
                                                            />
                                                        </TableCell>
                                                        {/* Valor Mínimo */}
                                                        <TableCell align="center">
                                                            <TextField
                                                                label="Valor"
                                                                variant="outlined"
                                                                value={
                                                                    parcela
                                                                        .value
                                                                        .par_valor_min
                                                                }
                                                                onChange={(
                                                                    a
                                                                ) => {
                                                                    let value =
                                                                        a.target
                                                                            .value;
                                                                    setValorMinParcela(
                                                                        value
                                                                    );
                                                                }}
                                                            />
                                                        </TableCell>
                                                        {/* Quantidade de parcelas */}
                                                        <TableCell align="center">
                                                            <TextField
                                                                label="Parcelas"
                                                                variant="outlined"
                                                                value={
                                                                    parcela
                                                                        .value
                                                                        .par_count
                                                                }
                                                                onChange={(
                                                                    a
                                                                ) => {
                                                                    let value =
                                                                        a.target
                                                                            .value;
                                                                    setNumMaxParcelas(
                                                                        value
                                                                    );
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Delete
                                                                style={{
                                                                    cursor: "pointer",
                                                                }}
                                                                onClick={() => {
                                                                    const idRegraParcela =
                                                                        parcela
                                                                            .value
                                                                            .par_id;
                                                                    deletarRegraParcela(
                                                                        idRegraParcela
                                                                    )
                                                                        .then(
                                                                            (
                                                                                resposta
                                                                            ) => {
                                                                                // console.log(
                                                                                //     "Regra de parcela deletada:",
                                                                                //     resposta
                                                                                // );
                                                                                window.location.reload();
                                                                            }
                                                                        )
                                                                        .catch(
                                                                            (
                                                                                erro
                                                                            ) => {
                                                                                console.error(
                                                                                    "Erro ao deletar regra de parcela:",
                                                                                    erro
                                                                                );
                                                                            }
                                                                        );
                                                                    // console.log(
                                                                    //     idRegraParcela
                                                                    // );
                                                                }}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                        {/* Gerador de senha */}
                        <Grid item xs={12} md={12} lg={12}>
                            <Paper sx={{ p: 2, pb: 4, mb: 2 }}>
                                <Typography
                                    variant="h5"
                                    component="div"
                                    align="center"
                                    sx={{
                                        paddingTop: 2,
                                        px: 2,
                                        fontFamily:
                                            '"Century Gothic", Futura, sans-serif',
                                        fontWeight: "bold",
                                    }}
                                    gutterBottom
                                >
                                    Gerador de Senhas Provisórias
                                </Typography>
                                <Divider
                                    sx={{
                                        my: 2,
                                        mx: 20,
                                        backgroundColor: "var(--blue)",
                                    }}
                                />
                                <Grid
                                    container
                                    spacing={3}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <RadioGroup
                                        row
                                        aria-label="Opções"
                                        name="opcoes"
                                        value={selectedOption}
                                        onChange={handleOptionChange}
                                        sx={{ justifyContent: "center", mt: 5 }}
                                    >
                                        <FormControlLabel
                                            value="Cancelamento"
                                            control={<Radio />}
                                            label="Cancelamento"
                                        />
                                        <FormControlLabel
                                            value="Configurações"
                                            control={<Radio />}
                                            label="Configurações"
                                        />
                                        <FormControlLabel
                                            value="Reimpressão"
                                            control={<Radio />}
                                            label="Reimpressão"
                                        />
                                    </RadioGroup>
                                    <Grid item xs={12} md={12} lg={12}>
                                        <Typography
                                            variant="body"
                                            component="div"
                                            sx={{
                                                padding: 2.5,
                                                pb: 2,
                                                pt: 1,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            <LocalActivityIcon
                                                sx={{
                                                    color: "var(--blue)",
                                                    marginRight: 1,
                                                    marginBottom: -1,
                                                }}
                                            />
                                            Senha Provisória:
                                        </Typography>
                                        {/* campo de senha provisória */}
                                        <TextField
                                            id="outlined-basic"
                                            variant="outlined"
                                            style={{
                                                width: "100%",
                                                height: 50,
                                            }}
                                            value={senha}
                                            InputLabelProps={{ shrink: true }}
                                            disabled
                                            //value={}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        md={12}
                                        lg={12}
                                        sx={{ textAlign: "center" }}
                                    >
                                        {/* botão de gerar senha */}
                                        {/*disabled={loading || !parcelaOpcao}*/}
                                        {/*{loading ? 'Gerando...' : 'Gerar'}*/}
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            onClick={() => {
                                                const radioOption =
                                                    selectedOption;
                                                genPass(radioOption)
                                                    .then((resposta) => {
                                                        // console.log(
                                                        //     "Senha gerada:",
                                                        //     resposta
                                                        // );
                                                    })
                                                    .catch((erro) => {
                                                        console.error(
                                                            "Erro ao gerar senha:",
                                                            erro
                                                        );
                                                    });
                                            }}
                                            sx={{ m: 2, width: 100 }}
                                        >
                                            Gerar
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
}
