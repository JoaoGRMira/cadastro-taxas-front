import React, { useEffect, useMemo, useState } from 'react';
import { DropdownList, NumberPercentMask } from '../components';
import Connection from '../model';
import { Box, Button, Checkbox, Container, Divider, FormControl, Grid, Paper, Table, TableBody, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { styled } from '@mui/material/styles';
const axios = Connection()

export default function CadastroTaxa() {
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
				minWidth: '100px',
			},
			'&:nth-of-type(5)': {
				minWidth: '50px',
			},
			'&:nth-of-type(6)': {
				minWidth: '100px',
			},
			'&:nth-of-type(7)': {
				minWidth: '50px',
			},
			'&:nth-of-type(8)': {
				minWidth: '100px',
			},
			'&:nth-of-type(9)': {
				minWidth: '50px',
			},
			'&:nth-of-type(10)': {
				minWidth: '100px',
			},
			'&:nth-of-type(11)': {
				minWidth: '50px',
			},
			'&:nth-of-type(12)': {
				minWidth: '100px',
			},
			'&:nth-of-type(13)': {
				minWidth: '100px',
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
	const [parcela_loading, setParcelaLoading] = useState(false);

	const [evento, setEvento] = useState(null);
	const [eventosList, setEventosList] = useState([]);
	const [classesList, setClassesList] = useState([]);
	const [parcelaOpcao, setParcelaOpcao] = useState([]);
	const [regraParcela, setRegraParcela] = useState([]);
	const [parcelasList, setParcelasList] = useState([]);

	const [taxaPadrao, setTaxaPadrao] = useState('0,00');

	const [idParcela, setIdParcela] = useState('')
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
	function saveParcela(e) {
		e.preventDefault();

		setLoading(true);
		axios.post('parcela', {par_id: parcelaOpcao.par_id, par_count: parcelaOpcao.par_count, par_valor_min: parcelaOpcao.par_valor_min })
			.then(resp => {
				if (resp.data) {
					alert('Parcela Salva')
				}
			})
			.finally(() => setLoading(false));
	}

	/**
	 * @param {number} parcelaOpcao 
	 */
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
	console.log(parcelasList)

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
					label="Valor R$"
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

	console.log(parcelaOpcao)
	return <>
		<Box sx={{ display: 'flex' }}>
			<Container maxWidth="xl" sx={{ mt: 4 }}>
				<Grid container spacing={3}>
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
													label="Valor R$"
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
													label="Valor R$"
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
													label="Valor R$"
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
													label="Valor R$"
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
													label="Valor R$"
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
									<Button variant="contained" type='submit' disabled={loading || !parcelaOpcao} onClick={saveParcela} sx={{ m: 2, width: 100 }}>{loading ? 'Salvando...' : 'Salvar'}</Button>
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
												if (parcelaOpcao !== null) {
													getParcelas(parcelaOpcao?.value.eve_cod);
												}
												else {
													setRegraParcela([]);
												}
											}}
										/>
									</FormControl>
								</Grid>
							</Grid>
						</Paper>
					</Grid>
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
											<StyledTableHeaderCell align="center">Valor Mínimo</StyledTableHeaderCell>
											<StyledTableHeaderCell align="center">Quantidade de Parcelas</StyledTableHeaderCell>
										</StyledTableRow>
									</TableHead>
									<TableBody>
										<TableRow>
											{/* Valor Mínimo */}
											<TableCell align="center">
												<TextField
													label="Valor R$"
													variant="outlined"
													//value={}
												/>
											</TableCell>
											{/* Quantidade de parcelas */}
											<TableCell align='center'>
												<TextField
													label="Valor R$"
													variant="outlined"
													//value={}
												/>
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</TableContainer>
						</Paper>
					</Grid>
				</Grid>
			</Container>
		</Box>
	</>
}