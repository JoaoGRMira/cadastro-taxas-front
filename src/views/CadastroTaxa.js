import React, { useEffect, useMemo, useState } from 'react';
import { DropdownList, NumberPercentMask } from '../components';
import Connection from '../model';
import { Box, Button, Checkbox, Container, Divider, FormControl, Grid, Paper, Table, TableBody, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { styled } from '@mui/material/styles';
import { Delete, Edit } from '@mui/icons-material';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
const axios = Connection()

export default function CadastroTaxa() {
	//Estilos da tabela
	const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
		[`&.${tableCellClasses.head}`]: {
			backgroundColor: theme.palette.common.white,
			color: theme.palette.common.black,
			fontSize: 15,
			'&:nth-of-type(1)': {
				minWidth: '100px',
			},
			'&:nth-of-type(2)': {
				minWidth: '100px',
			},
			'&:nth-of-type(3)': {
				minWidth: '200px',
			},
			'&:nth-of-type(4)': {
				minWidth: '150px',
			},
			'&:nth-of-type(5)': {
				minWidth: '50px',
			},
			'&:nth-of-type(6)': {
				minWidth: '150px',
			},
			'&:nth-of-type(7)': {
				minWidth: '50px',
			},
			'&:nth-of-type(8)': {
				minWidth: '150px',
			},
			'&:nth-of-type(9)': {
				minWidth: '50px',
			},
			'&:nth-of-type(10)': {
				minWidth: '150px',
			},
			'&:nth-of-type(11)': {
				minWidth: '50px',
			},
			'&:nth-of-type(12)': {
				minWidth: '150px',
			},
			'&:nth-of-type(13)': {
				minWidth: '150px',
			},
			'&:nth-of-type(14)': {
				minWidth: '50px',
			},
		},
		[`&.${tableCellClasses.body}`]: {
			fontSize: 15,
			padding: 11,
		},
		borderBottom: '1px solid var(--grey-shadow)',
	}));

	//Estilos da célula da tabela
	const StyledTableCell = styled(TableCell)(({ theme }) => ({
		[`&.${tableCellClasses.head}`]: {
			backgroundColor: theme.palette.common.white,
			color: theme.palette.common.black,
			fontSize: 15,
		},
		[`&.${tableCellClasses.body}`]: {
			fontSize: 15,
			padding: 11,
		},
		borderBottom: '1px solid var(--grey-shadow)',
		width: '200px',
	}));

	//Estilos da linha da tabela
	const StyledTableRow = styled(TableRow)(({ theme }) => ({
		'&:nth-of-type(odd)': {
			backgroundColor: 'var(--grey-shadow)',
		},
		'&:nth-of-type(even)': {
			backgroundColor: 'white',
		},
		'&:last-child td, &:last-child th': {
			borderBottom: '1px solid var(--grey-shadow)',
			color: 'var(--grey)',
			fontWeight: 'bold',
			fontFamily: '"Century Gothic", Futura, sans-serif',
			backgroundColor: 'white',
		},
	}));

	const [loading, setLoading] = useState(false);
	const [classe_loading, setClasseLoading] = useState(false);
	//const [parcela_loading, setParcelaLoading] = useState(false);

	const [evento, setEvento] = useState(null);
	const [eventosList, setEventosList] = useState([]);
	const [classesList, setClassesList] = useState([]);
	const [parcelaOpcao, setParcelaOpcao] = useState([]);
	//const [regraParcela, setRegraParcela] = useState([]);
	const [parcelasList, setParcelasList] = useState([]);

	const [taxaPadrao, setTaxaPadrao] = useState('0,00');

	//const [idParcela, setIdParcela] = useState('')
	const [valorMinParcela, setValorMinParcela] = useState('0,00');
	const [numMaxParcelas, setNumMaxParcelas] = useState('0');

	const [dinheiro, setDinheiro] = useState('0,00');
	const [dinheiro_perc, setDinheiro_perc] = useState(0);

	const [credito, setCredito] = useState('0,00');
	const [credito_perc, setCredito_perc] = useState(0);

	const [debito, setDebito] = useState('0,00');
	const [debito_perc, setDebito_perc] = useState(0);

	const [pix, setPix] = useState('0,00');
	const [pix_perc, setPix_perc] = useState(0);

	const [parcelaMax, setParcelaMax] = useState(1);

	const [parcela, setParcela] = useState('0,00');
	const [parcela_perc, setParcela_perc] = useState(0);

	const [selectedOption, setSelectedOption] = useState('cancelar'); // Estado para controlar a opção selecionada
	const [senha, setSenha] = useState(null); // Estado para controlar a opção selecionada

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

	const limite_parcelas = useMemo(() => {
		if (classesList.length > 0) {
			let limits = classesList.map(classe => {
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
	function saveTaxa(e) {
		e.preventDefault();

		setLoading(true);
		axios.post(`save/taxa`, {
			evento: evento.value,
			classes: classesList.map(a => a.value)
		})
			.then(resp => {
				if (resp.data) {
					alert('Sobretaxa Salva')
				}
			})
			.finally(() => setLoading(false));
	}

	/**
	 * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e 
	 */
	const criarRegraParcela = async (dadosRegraParcela) => {
		try {
			const response = await axios.post('/parcela', dadosRegraParcela);
			return response.data;
		} catch (error) {
			console.error('Erro ao criar regra de parcela:', error);
			throw error;
		}
	};

	const atualizarRegraParcela = async (editarRegraParcela) => {
		try {
			const response = await axios.put('/parcela', editarRegraParcela);
			return response.data;
		} catch (error) {
			console.error('Erro ao atualizar regra de parcela:', error);
			throw error;
		}
	};

	const deletarRegraParcela = async (idRegraParcela) => {
		try {
			const response = await axios.delete(`/parcela?id=${idRegraParcela}`);
			return response.data;
		} catch (error) {
			console.error('Erro ao deletar regra de parcela:', error);
			throw error;
		}
	};

	const genPass = async (radioOption) => {
		try {
			const response = await axios.get(`/gen_pass?tipo=${radioOption}`);
			setSenha(response.data.senha)
    		return senha;
		} catch (error) {
			console.error('Erro ao gerar senha:', error);
			throw error;
		}
	};

	/**
	 * @param {number} parcelaOpcao 
	 */
	/*
	function getParcelas(parcelaOpcao) {
		setParcelaLoading(true);
		axios.post('parcela', { parcelaOpcao })
			.then(resp => {
				setRegraParcela(resp.data.map(a => ({
					value: a,
					label: a.par_valor_min
				})));
			})
			.finally(() => setParcelaLoading(false));
	}
	*/

	/**
	 * @param {number} evento 
	 */
	function getClasses(evento) {
		setClasseLoading(true);
		axios.post('classes', { evento })
			.then(resp => {
				setClassesList(resp.data.map(a => ({
					value: a,
					label: a.cla_nome
				})));
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
		classesList.map(classe => (
			classe.value.pdvs.map(pdv => {
				pdv[local][prop] = valor
				return pdv
			})
		));
	}

	useEffect(() => {
		let execute = true;

		axios.get('eventos')
			.then(resp => {
				if (!eventosList.length && execute) {
					setEventosList(resp.data.map(a => ({
						value: a,
						label: a.eve_nome
					})));
				}
			});

		return () => { execute = false; }
	}, [eventosList]);

	useEffect(() => {
		let execute = true;
		//Consulta os dados de parcela e armazena no useState
		axios.get('parcela')
			.then(resp => {
				if (!parcelasList.length && execute) {
					setParcelasList(resp.data.map(a => ({
						value: a,
						label: a.par_valor_min
					})));
				}
			});

		return () => { execute = false; }
	}, [parcelasList]);
	//console.log(parcelasList)

	/*useEffect(() => {
		let execute = true;
		// Consulta os dados de senha e armazena no useState
		axios.get(`gen_pass?tipo=${selectedOption}`)
		  .then(resp => {
			if (execute) {
			  setSenha(resp.data.senha);
			}
		  })
		  .catch(error => {
			console.error(error);
		  });
	  
		return () => {
		  execute = false;
		}
	  }, [selectedOption]);
	  
	console.log(senha)*/

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
		taxa, setTaxa, onChange,
		percent, setPercent, onCheck
	}) {
		return <>
			{/* Taxa */}
			<TableCell align='center'>
				<TextField
					label="Valor"
					variant="outlined"
					value={percent ? `${taxa} %` : `R$ ${taxa}`}
					onChange={a => {
						let value = NumberPercentMask(a.target.value, percent);

						setTaxa(value);
						onChange(value);
					}}
				/>
			</TableCell>
			{/* % */}
			<TableCell align='center'>
				<Checkbox checked={percent} onChange={() => {
					let perc = !percent ? 1 : 0;

					setPercent(perc);
					onCheck(perc);
				}} />

			</TableCell>
		</>
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
	 *			par_max: number,
	 *			par_acrescimo: string,
	 *			par_acrescimo_perc: 0|1,
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
		const [dinheiro, setDinheiro] = useState(NumberPercentMask(pdv.taxa.tax_dinheiro))
		const [dinheiro_perc, setDinheiro_perc] = useState(pdv.taxa.tax_dinheiro_perc)

		const [credito, setCredito] = useState(NumberPercentMask(pdv.taxa.tax_credito))
		const [credito_perc, setCredito_perc] = useState(pdv.taxa.tax_credito_perc)

		const [debito, setDebito] = useState(NumberPercentMask(pdv.taxa.tax_debito))
		const [debito_perc, setDebito_perc] = useState(pdv.taxa.tax_debito_perc)

		const [pix, setPix] = useState(NumberPercentMask(pdv.taxa.tax_pix))
		const [pix_perc, setPix_perc] = useState(pdv.taxa.tax_pix_perc);

		const [parcelaMax, setParcelaMax] = useState(pdv.parcela.par_max);

		const [parcela, setParcela] = useState(NumberPercentMask(pdv.parcela.par_acrescimo))
		const [parcela_perc, setParcela_perc] = useState(pdv.parcela.par_acrescimo_perc)

		const limite_parcelas = Math.floor(valor_ing);

		return <TableRow className={show ? '' : 'collapsed'}>
			{/* PDV */}
			<TableCell align='center' sx={{ borderLeft: '1px solid var(--grey-shadow)' }}>{pdv.pdv_nome}</TableCell>

			{/* Dinheiro */}
			<TaxaInput
				taxa={dinheiro}
				setTaxa={setDinheiro}
				onChange={value => pdv.taxa.tax_dinheiro = value}
				percent={dinheiro_perc}
				setPercent={setDinheiro_perc}
				onCheck={perc => pdv.taxa.tax_dinheiro_perc = perc}
			/>

			{/* Crédito */}
			<TaxaInput
				taxa={credito}
				setTaxa={setCredito}
				onChange={value => pdv.taxa.tax_credito = value}
				percent={credito_perc}
				setPercent={setCredito_perc}
				onCheck={perc => pdv.taxa.tax_credito_perc = perc}
			/>

			{/* Débito */}
			<TaxaInput
				taxa={debito}
				setTaxa={setDebito}
				onChange={value => pdv.taxa.tax_debito = value}
				percent={debito_perc}
				setPercent={setDebito_perc}
				onCheck={perc => pdv.taxa.tax_debito_perc = perc}
			/>

			{/* PIX */}
			<TaxaInput
				taxa={pix}
				setTaxa={setPix}
				onChange={value => pdv.taxa.tax_pix = value}
				percent={pix_perc}
				setPercent={setPix_perc}
				onCheck={perc => pdv.taxa.tax_pix_perc = perc}
			/>

			{/* Parcelas Max */}
			<TableCell align='center'>
				<TextField
					label="Parcelas"
					type="number"
					variant="outlined"
					max={limite_parcelas}
					value={parcelaMax}
					onChange={a => {
						let value = parseInt(!!a.target.value
							? a.target.value : 1
						);
						if (value >= 0 && value <= limite_parcelas) {
							setParcelaMax(value);
							updateAllTax('parcela', 'par_max', value);
						} else if (value > limite_parcelas) {
							setParcelaMax(limite_parcelas);
							updateAllTax('parcela', 'par_max', limite_parcelas);
						} else {
							setParcelaMax(0);
							updateAllTax('parcela', 'par_max', 0);
						}
					}}
				/>
			</TableCell>

			{/* Taxa Parcela */}
			<TaxaInput
				taxa={parcela}
				setTaxa={setParcela}
				onChange={value => pdv.parcela.par_acrescimo = value}
				percent={parcela_perc}
				setPercent={setParcela_perc}
				onCheck={perc => pdv.parcela.par_acrescimo_perc = perc}
			/>
		</TableRow>
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
		const [collapsed, setCollapsed] = useState(true);

		let rowSpan = collapsed ? Object.keys(classe.value.pdvs).length + 1 : 1;

		return <>
			<TableRow className='classe'>
				<TableCell rowSpan={rowSpan} align='center'>
					<div>
						<p>{classe.label}</p>
					</div>
				</TableCell>
				<TableCell rowSpan={rowSpan} align='center'>
					<p>R$ {NumberPercentMask(classe.value.cla_valor, 0)}</p>
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
			<TableRow className='table-separator' />
		</>
	}

	//console.log(selectedOption)
	/*console.log(parcelaOpcao)
	console.log(parcelaOpcao.value.par_id)
	console.log(numMaxParcelas)
	console.log(valorMinParcela)*/
	return <>
		<Box sx={{ display: 'flex' }}>
			<Container maxWidth="xl" sx={{ mt: 4 }}>
				<Grid container spacing={3}>
					{/* Área de Sobretaza */}
					<Grid item xs={12} md={12} lg={12}>
						<Paper sx={{ p: 2 }}>
							<Typography variant="h5" component="div" align="center" sx={{ paddingTop: 2, px: 2, fontFamily: '"Century Gothic", Futura, sans-serif', fontWeight: 'bold' }} gutterBottom>
								Sobretaxa de Ingresso
							</Typography>
							<Divider sx={{ my: 2, mx: 20, backgroundColor: 'var(--blue)' }} />
							<Grid container spacing={3}>
								<Grid item xs={12} md={6} lg={6}>
									<Typography variant="body" component='div' sx={{ padding: 2, pb: 2, fontWeight: 'bold' }}>
										<CalendarTodayIcon sx={{ color: 'var(--blue)', marginRight: 1, marginBottom: -0.5 }} />
										Evento:
									</Typography>
									{/* dropdown seleção de evento */}
									<FormControl sx={{ width: '100%', height: 50 }}>
										<DropdownList
											data={eventosList}
											value={evento}
											placeholder={'Selecionar Evento...'}
											disabled={!eventosList.length}
											onChangeHandler={evento => {
												setEvento(evento);

												if (evento !== null) {
													getClasses(evento?.value.eve_cod);
													setTaxaPadrao(NumberPercentMask(evento?.value.eve_taxa_valor, 0));
												}
												else {
													setClassesList([]);
													setTaxaPadrao('0,00');
												}
											}}
										/>
									</FormControl>
								</Grid>
								<Grid item xs={12} md={6} lg={6}>
									<Typography variant="body" component='div' sx={{ padding: 2.5, pb: 2, fontWeight: 'bold' }}>
										<LocalActivityIcon sx={{ color: 'var(--blue)', marginRight: 1, marginBottom: -1 }} />
										Taxa Padrão:
									</Typography>
									{/* campo de taxa padrão */}
									<TextField id="outlined-basic" label="R$" variant="outlined" style={{ width: '100%', height: 50 }} InputLabelProps={{ shrink: true }} value={taxaPadrao}
										onChange={a => {
											let value = NumberPercentMask(a.target.value, 0);
											setTaxaPadrao(value);
											evento.value.eve_taxa_valor = value;
										}} />
								</Grid>
								<Grid item xs={12} sx={{ textAlign: 'center' }}>
									{/* botão salvar taxa */}
									<Button variant="contained" type='submit' disabled={loading || !evento} onClick={saveTaxa} sx={{ mt: 2, width: 100 }}>{loading ? 'Salvando...' : 'Salvar'}</Button>
								</Grid>
							</Grid>
						</Paper>
					</Grid>
					{/* Tabela de Taxas */}
					<Grid item xs={12} md={12} lg={12}>
						<Paper sx={{ mb: 3 }}>
							<TableContainer>
								<Typography variant="h6" component="div" sx={{ padding: 2, fontFamily: '"Century Gothic", Futura, sans-serif', fontWeight: 'bold', color: 'var(--blue)' }}>
									<EventAvailableIcon sx={{ color: 'var(--blue)', marginRight: 1, marginBottom: -0.5 }} />
									Taxas do Evento
								</Typography>
								<Table aria-label="customized table">
									<TableHead>
										{/* header da tabela de taxas */}
										<StyledTableRow>
											<StyledTableHeaderCell align="center">Classes</StyledTableHeaderCell>
											<StyledTableHeaderCell align="center">Valor Ingresso</StyledTableHeaderCell>
											<StyledTableHeaderCell align="center">PDV</StyledTableHeaderCell>
											<StyledTableHeaderCell align="center">Dinheiro</StyledTableHeaderCell>
											<StyledTableHeaderCell align="center">%</StyledTableHeaderCell>
											<StyledTableHeaderCell align="center">Crédito</StyledTableHeaderCell>
											<StyledTableHeaderCell align="center">%</StyledTableHeaderCell>
											<StyledTableHeaderCell align="center">Débito</StyledTableHeaderCell>
											<StyledTableHeaderCell align="center">%</StyledTableHeaderCell>
											<StyledTableHeaderCell align="center">PIX</StyledTableHeaderCell>
											<StyledTableHeaderCell align="center">%</StyledTableHeaderCell>
											<StyledTableHeaderCell align="center">Parcelas Max</StyledTableHeaderCell>
											<StyledTableHeaderCell align="center">Taxa Parcelas</StyledTableHeaderCell>
											<StyledTableHeaderCell align="center">%</StyledTableHeaderCell>
										</StyledTableRow>
									</TableHead>
									<TableBody>
										<TableRow>
											<TableCell colSpan='3' />
											{/* Dinheiro */}
											<TableCell align="center">
												<TextField
													label="Valor"
													variant="outlined"
													value={dinheiro_perc ? `${dinheiro} %` : `R$ ${dinheiro}`}
													onChange={a => {
														let value = NumberPercentMask(a.target.value, dinheiro_perc);

														setDinheiro(value);
														updateAllTax('taxa', 'tax_dinheiro', value);
													}}
												/>
											</TableCell>
											{/* % */}
											<TableCell align='center'>
												<Checkbox checked={dinheiro_perc} onChange={() => {
													let perc = !dinheiro_perc ? 1 : 0;

													setDinheiro_perc(perc);
													updateAllTax('taxa', 'tax_dinheiro_perc', perc);
												}} />
											</TableCell>
											{/* Crédito */}
											<TableCell align='center'>
												<TextField
													label="Valor"
													variant="outlined"
													value={credito_perc ? `${credito} %` : `R$ ${credito}`}
													onChange={a => {
														let value = NumberPercentMask(a.target.value, credito_perc);

														setCredito(value);
														updateAllTax('taxa', 'tax_credito', value);
													}}
												/>
											</TableCell>
											{/* % */}
											<TableCell align='center'>
												<Checkbox checked={credito_perc} onChange={() => {
													let perc = !credito_perc ? 1 : 0;

													setCredito_perc(perc);
													updateAllTax('taxa', 'tax_credito_perc', perc);
												}} />
											</TableCell>
											{/* Débito */}
											<TableCell align='center'>
												<TextField
													label="Valor"
													variant="outlined"
													value={debito_perc ? `${debito} %` : `R$ ${debito}`}
													onChange={a => {
														let value = NumberPercentMask(a.target.value, debito_perc);

														setDebito(value);
														updateAllTax('taxa', 'tax_debito', value);
													}}
												/>
											</TableCell>
											{/* % */}
											<TableCell align='center'>
												<Checkbox checked={debito_perc} onChange={() => {
													let perc = !debito_perc ? 1 : 0;

													setDebito_perc(perc);
													updateAllTax('taxa', 'tax_debito_perc', perc);
												}} />
											</TableCell>
											{/* PIX */}
											<TableCell align='center'>
												<TextField
													label="Valor"
													variant="outlined"
													value={pix_perc ? `${pix} %` : `R$ ${pix}`}
													onChange={a => {
														let value = NumberPercentMask(a.target.value, pix_perc);

														setPix(value);
														updateAllTax('taxa', 'tax_pix', value);
													}}
												/>
											</TableCell>
											{/* % */}
											<TableCell align='center'>
												<Checkbox checked={pix_perc} onChange={() => {
													let perc = !pix_perc ? 1 : 0;

													setPix_perc(perc);
													updateAllTax('taxa', 'tax_pix_perc', perc);
												}} />
											</TableCell>
											{/* Parcelas Max */}
											<TableCell align='center'>
												<TextField
													label="Parcelas"
													type="number"
													variant="outlined"
													max={limite_parcelas}
													min="0"
													value={parcelaMax}
													onChange={a => {
														let value = parseInt(!!a.target.value
															? a.target.value : 1
														);

														if (value >= 0 && value <= limite_parcelas) {
															setParcelaMax(value);
															updateAllTax('parcela', 'par_max', value);
														} else if (value > limite_parcelas) {
															setParcelaMax(limite_parcelas);
															updateAllTax('parcela', 'par_max', limite_parcelas);
														} else {
															setParcelaMax(0);
															updateAllTax('parcela', 'par_max', 0);
														}
													}}
												/>
											</TableCell>
											{/* Taxa Parcela */}
											<TableCell align='center'>
												<TextField
													label="Valor"
													variant="outlined"
													value={parcela_perc ? `${parcela} %` : `R$ ${parcela}`}
													onChange={a => {
														let value = NumberPercentMask(a.target.value, parcela_perc);

														setParcela(value);
														updateAllTax('parcela', 'par_acrescimo', value);
													}}
												/>
											</TableCell>
											{/* % */}
											<TableCell align='center'>
												<Checkbox checked={parcela_perc} onChange={() => {
													let perc = !parcela_perc ? 1 : 0;

													setParcela_perc(perc);
													updateAllTax('parcela', 'par_acrescimo_perc', perc);
												}} />
											</TableCell>
										</TableRow>
										<tr className='table-separator' />
										{!!classesList.length && classesList.map((classe, index) => {
											return <ClasseFragment
												key={index}
												classe={classe}
											/>
										})}
										{!!evento && classesList.length === 0 && !classe_loading && <tr>
											<th colSpan={13}>
												Sem ingressos alocados
											</th>
										</tr>}
									</TableBody>
								</Table>
							</TableContainer>
						</Paper>
					</Grid>
					{/* Área de Regras de Parcelas*/}
					<Grid item xs={12} md={12} lg={12}>
						<Paper sx={{ p: 2 }}>
							<Typography variant="h5" component="div" align="center" sx={{ paddingTop: 2, px: 2, fontFamily: '"Century Gothic", Futura, sans-serif', fontWeight: 'bold' }} gutterBottom>
								Regras de Parcelas
							</Typography>
							<Divider sx={{ my: 2, mx: 20, backgroundColor: 'var(--blue)' }} />
							<Grid container spacing={3}>
								<Grid item xs={12} md={6} lg={6}>
									<Typography variant="body" component='div' sx={{ padding: 2.5, pb: 2, fontWeight: 'bold' }}>
										<LocalActivityIcon sx={{ color: 'var(--blue)', marginRight: 1, marginBottom: -1 }} />
										Valor Mínimo:
									</Typography>
									{/* campo de valor mínimo por parcela */}
									<TextField
										id="outlined-basic"
										variant="outlined"
										style={{ width: '100%', height: 50 }}
										InputLabelProps={{ shrink: true }}
										//(parcelaOpcao.value && parcelaOpcao.value.par_valor_min) ||
										value={(parcelaOpcao.value && parcelaOpcao.value.par_valor_min) || valorMinParcela}
										onChange={(a) => {
											let value = a.target.value;
											setValorMinParcela(value);
											if (parcelaOpcao.value) {
												parcelaOpcao.value.par_valor_min = value;
											}
										}}
									/>
								</Grid>
								<Grid item xs={12} md={6} lg={6}>
									<Typography variant="body" component='div' sx={{ padding: 2.5, pb: 2, fontWeight: 'bold' }}>
										<LocalActivityIcon sx={{ color: 'var(--blue)', marginRight: 1, marginBottom: -1 }} />
										Máximo de Parcelas:
									</Typography>
									{/* campo de máximo de parcelas permitidas */}
									<TextField
										id="outlined-basic"
										variant="outlined"
										style={{ width: '100%', height: 50 }}
										InputLabelProps={{ shrink: true }}
										//(parcelaOpcao.value && parcelaOpcao.value.par_count) ||
										value={(parcelaOpcao.value && parcelaOpcao.value.par_count) || numMaxParcelas}
										onChange={(a) => {
											let value = a.target.value;
											setNumMaxParcelas(value);
											if (parcelaOpcao.value) {
												parcelaOpcao.value.par_count = value;
											}
										}}
									/>
								</Grid>
								<Grid item xs={12} sx={{ textAlign: 'center' }}>
									{/* botão de salvar parcela */}
									<Button
										variant="contained"
										type='submit'
										//disabled={loading || !parcelaOpcao}
										onClick={() => {
											const dadosRegraParcela = {
												par_valor_min: valorMinParcela,
												par_count: numMaxParcelas
											};
											criarRegraParcela(dadosRegraParcela)
												.then((resposta) => {
													console.log('Regra de parcela criada:', resposta);
													window.location.reload()
												})
												.catch((erro) => {
													console.error('Erro ao criar regra de parcela:', erro);
												});
											console.log(dadosRegraParcela)
										}}
										sx={{ m: 2, width: 100 }}
									>
										{/*{loading ? 'Salvando...' : 'Salvar'}*/} Criar
									</Button>
								</Grid>
								<Grid item xs={12} md={12} lg={12}>
									<Typography variant="body" component='div' sx={{ px: 2, pb: 2, fontWeight: 'bold' }}>
										<CalendarTodayIcon sx={{ color: 'var(--blue)', marginRight: 1, marginBottom: -0.5 }} />
										Parcelas:
									</Typography>
									<FormControl sx={{ width: '100%', height: 50, marginBottom: 5 }}>
										{/* dropdown seleção de parcelas existentes */}
										<DropdownList
											data={parcelasList}
											value={parcelaOpcao}
											placeholder={'Selecionar Parcela...'}
											disabled={!parcelasList.length}
											onChangeHandler={parcelaOpcao => {
												setParcelaOpcao(parcelaOpcao);
											}}
										/>
									</FormControl>
								</Grid>
								<Grid item xs={12} sx={{ textAlign: 'center' }}>
									{/* botão de editar parcela */}
									<Button
										variant="contained"
										type='submit'
										//disabled={loading || !parcelaOpcao}
										onClick={() => {
											const editarRegraParcela = {
												par_id: parcelaOpcao.value.par_id,
												par_valor_min: valorMinParcela,
												par_count: numMaxParcelas
											};
											atualizarRegraParcela(editarRegraParcela)
												.then((resposta) => {
													console.log('Regra de parcela atualizada:', resposta);
													window.location.reload()
												})
												.catch((erro) => {
													console.error('Erro ao atualizar regra de parcela:', erro);
												});
											console.log(editarRegraParcela)
										}}
										sx={{ m: 2, width: 100 }}
									>
										{/*{loading ? 'Salvando...' : 'Salvar'}*/} Editar
									</Button>
								</Grid>
							</Grid>
						</Paper>
					</Grid>
					{/* Tabela de Regras de Parcelas */}
					<Grid item xs={12} md={12} lg={12}>
						<Paper sx={{ mb: 3 }}>
							<TableContainer>
								<Typography variant="h6" component="div" sx={{ padding: 2, fontFamily: '"Century Gothic", Futura, sans-serif', fontWeight: 'bold', color: 'var(--blue)' }}>
									<EventAvailableIcon sx={{ color: 'var(--blue)', marginRight: 1, marginBottom: -0.5 }} />
									Regras de Parcela
								</Typography>
								<Table aria-label="customized table">
									<TableHead>
										{/* header da tabela de taxas */}
										<StyledTableRow>
											<StyledTableHeaderCell align="center">ID da Regra</StyledTableHeaderCell>
											<StyledTableHeaderCell align="center">Valor Mínimo</StyledTableHeaderCell>
											<StyledTableHeaderCell align="center">Quantidade de Parcelas</StyledTableHeaderCell>
											{/*<StyledTableHeaderCell align="center">Editar</StyledTableHeaderCell>*/}
											<StyledTableHeaderCell align="center">Excluir</StyledTableHeaderCell>
										</StyledTableRow>
									</TableHead>
									<TableBody>
										{parcelasList.map((parcela, index) => (
											<TableRow key={index}>
												{/* ID da Regra */}
												<TableCell align="center">
													<TextField
														label="ID"
														variant="outlined"
														disabled
														value={parcela.value.par_id}
													/>
												</TableCell>
												{/* Valor Mínimo */}
												<TableCell align="center">
													<TextField
														label="Valor"
														variant="outlined"
														value={parcela.value.par_valor_min}
														onChange={(a) => {
															let value = a.target.value;
															setValorMinParcela(value);
														}}
													/>
												</TableCell>
												{/* Quantidade de parcelas */}
												<TableCell align="center">
													<TextField
														label="Parcelas"
														variant="outlined"
														value={parcela.value.par_count}
														onChange={(a) => {
															let value = a.target.value;
															setNumMaxParcelas(value);
														}}
													/>
												</TableCell>
												{/*<TableCell align="center">
													<Edit style={{ cursor: 'pointer' }}
														onClick={() => {
															const dadosRegraParcela = {
																par_id: parcela.value.par_id,
																par_valor_min: valorMinParcela,
																par_count: numMaxParcelas
															};
															atualizarRegraParcela(dadosRegraParcela)
																.then((resposta) => {
																	console.log('Regra de parcela atualizada:', resposta);
																})
																.catch((erro) => {
																	console.error('Erro ao atualizar regra de parcela:', erro);
																});
															console.log(dadosRegraParcela)
														}}
													/>
												</TableCell> */}
												<TableCell align="center">
													<Delete style={{ cursor: 'pointer' }}
														onClick={() => {
															const idRegraParcela = parcela.value.par_id;
															deletarRegraParcela(idRegraParcela)
																.then((resposta) => {
																	console.log('Regra de parcela deletada:', resposta);
																	window.location.reload()
															
																})
																.catch((erro) => {
																	console.error('Erro ao deletar regra de parcela:', erro);
																});
															console.log(idRegraParcela)
														}}
													/>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</Paper>
					</Grid>
					{/* Gerador de senha */}
					<Grid item xs={12} md={12} lg={12}>
						<Paper sx={{ p: 2, pb: 4, mb: 2 }}>
							<Typography variant="h5" component="div" align="center" sx={{ paddingTop: 2, px: 2, fontFamily: '"Century Gothic", Futura, sans-serif', fontWeight: 'bold' }} gutterBottom>
								Gerador de Senhas Provisórias
							</Typography>
							<Divider sx={{ my: 2, mx: 20, backgroundColor: 'var(--blue)' }} />
							<Grid container spacing={3} sx={{ display: 'flex', justifyContent: 'center' }}>
								<RadioGroup
									row
									aria-label="Opções"
									name="opcoes"
									value={selectedOption}
									onChange={handleOptionChange}
									sx={{ justifyContent: 'center', mt: 5 }}
									>
									<FormControlLabel value="Cancelamento" control={<Radio />} label="Cancelamento" />
									<FormControlLabel value="Configurações" control={<Radio />} label="Configurações" />
									<FormControlLabel value="Reimpressão" control={<Radio />} label="Reimpressão" />
								</RadioGroup>
								<Grid item xs={12} md={12} lg={12}>
									<Typography variant="body" component='div' sx={{ padding: 2.5, pb: 2, pt: 1,fontWeight: 'bold' }}>
										<LocalActivityIcon sx={{ color: 'var(--blue)', marginRight: 1, marginBottom: -1 }} />
										Senha Provisória:
									</Typography>
									{/* campo de senha provisória */}
									<TextField
										id="outlined-basic"
										variant="outlined"
										style={{ width: '100%', height: 50 }}
										value={senha}
										InputLabelProps={{ shrink: true }}
										disabled
									//value={}
									/>
								</Grid>
								<Grid item xs={12} md={12} lg={12} sx={{ textAlign: 'center' }}>
									{/* botão de gerar senha */}
									{/*disabled={loading || !parcelaOpcao}*/}
									{/*{loading ? 'Gerando...' : 'Gerar'}*/}
									<Button variant="contained" type='submit' onClick={() => {
											const radioOption = selectedOption
											genPass(radioOption)
												.then((resposta) => {
													console.log('Senha gerada:', resposta);
												})
												.catch((erro) => {
													console.error('Erro ao gerar senha:', erro);
												});
										}} sx={{ m: 2, width: 100 }}>Gerar</Button>
								</Grid>
							</Grid>
						</Paper>
					</Grid>
				</Grid>
			</Container>
		</Box>
	</>
}