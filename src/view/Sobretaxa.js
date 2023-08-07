import { Box, Container, Grid, Paper, Typography, TextField, TableContainer, Table, TableHead, TableRow, TableBody, Checkbox, FormControl, MenuItem, Select, OutlinedInput, Button, Divider } from "@mui/material";
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { fetchData, fetchClasses } from "./api";
import { useState, useEffect } from "react";

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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200,
    },
  },
};

function getStyles(name, eventName, theme) {
  return {
    fontWeight:
      eventName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function Sobretaxa() {
  const [eventName, seteventName] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [eventData, setEventData] = useState([]);
  const [eventOptions, setEventOptions] = useState([]);
  const [taxaPadrao, setTaxaPadrao] = React.useState("");

  const theme = useTheme();

  const handleChange = (event) => {
    const { value } = event.target;
    seteventName(typeof value === "string" ? [value] : value);

    const selectedEvent = eventOptions.find((option) => option.value === value);
    if (selectedEvent) {
      setTaxaPadrao(selectedEvent.taxa);
    } else {
      setTaxaPadrao("");
    }
  };

  const handleTextFieldChange = (event, index, field) => {
    const { value } = event.target;

    const updatedEventData = [...eventData];
    updatedEventData[index][field] = value;

    setEventData(updatedEventData);
  };

  useEffect(() => {
    let execute = true;

    const buscarEventoOptions = async () => {
      if (execute) {
        const eventos = await fetchData();

        const eventOptions = eventos.map(async (evento) => ({
          value: evento.eve_nome,
          label: evento.eve_nome,
          taxa: evento.eve_taxa_valor,
          data: await fetchClasses(evento.eve_cod),
        }));

        setEventOptions(await Promise.all(eventOptions));
      }
    }

    buscarEventoOptions();

    return () => { execute = false };
  }, []);

  useEffect(() => {
    if (eventName.length > 0) {
      const selectedOption = eventOptions.find((option) => option.value === eventName[0]);
      setSelectedEvent(selectedOption.label);

      if (selectedOption) {
        setEventData(selectedOption.data);
      } else {
        setEventData([]);
      }
    } else {
      setSelectedEvent('');
      setEventData([]);
    }
  }, [eventName, eventOptions]);


  const nomeEvento = eventOptions.find((option) => option.value === selectedEvent)?.label || 'Selecione um evento';

  return (
    <Box sx={{ display: 'flex' }}>
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h5" component="div" align="center" sx={{ paddingTop: 2, px: 2, fontFamily: '"Century Gothic", Futura, sans-serif', fontWeight: 'bold' }} gutterBottom>
                Sobretaxa de Ingresso
              </Typography>
              <Divider sx={{ my: 2, mx: 50, backgroundColor: 'var(--blue)' }} />
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={6}>
                  <Typography variant="body" component='div' sx={{ padding: 2, pb: 2, fontWeight: 'bold' }}>
                    <CalendarTodayIcon sx={{ color: 'var(--blue)', marginRight: 1, marginBottom: -0.5 }} />
                    Evento:
                  </Typography>
                  <FormControl sx={{ width: '100%', height: 50 }}>
                    <Select
                      displayEmpty
                      value={selectedEvent}
                      onChange={handleChange}
                      input={<OutlinedInput />}
                      renderValue={(selected) => {
                        if (!selected) {
                          return <em>Selecionar Evento</em>;
                        }
                        return selected;
                      }}
                      MenuProps={MenuProps}
                      inputProps={{ 'aria-label': 'Without label' }}
                      style={{ width: '100%' }}
                    >
                      <MenuItem disabled value="">
                        <em>Selecionar Evento</em>
                      </MenuItem>
                      {eventOptions.map((option) => (
                        <MenuItem
                          key={option.value}
                          value={option.value}
                          style={getStyles(option.value, eventName, theme)}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <Typography variant="body" component='div' sx={{ padding: 2.5, pb: 2, fontWeight: 'bold' }}>
                    <LocalActivityIcon sx={{ color: 'var(--blue)', marginRight: 1, marginBottom: -1 }} />
                    Taxa Padrão:
                  </Typography>
                  <TextField id="outlined-basic" label="R$" variant="outlined" style={{ width: '100%', height: 50 }} InputLabelProps={{ shrink: true }} value={taxaPadrao}
                    onChange={(e) => setTaxaPadrao(e.target.value)} />
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                  <Button variant="contained" sx={{ mt: 2, width: 100 }}>Salvar</Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Paper>
              <TableContainer>
                <Typography variant="h6" component="div" sx={{ padding: 2, fontFamily: '"Century Gothic", Futura, sans-serif', fontWeight: 'bold', color: 'var(--blue)' }}>
                  <EventAvailableIcon sx={{ color: 'var(--blue)', marginRight: 1, marginBottom: -0.5 }} />
                  {nomeEvento}
                </Typography>
                <Table aria-label="customized table">
                  <TableHead>
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
                    {eventData && eventData.length > 0 ? (
                      eventData.map((dataItem, index) => (
                        <TableRow key={index}>
                          <TableCell
                            align="center"
                            style={{
                              backgroundColor: index % 2 === 0 ? 'white' : 'var(--body-background)', borderRight: '1px solid var(--grey-shadow)',
                              fontWeight: 'bold',
                            }}
                          >
                            {dataItem.cla_nome}
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{ backgroundColor: index % 2 === 0 ? 'white' : 'var(--body-background)', borderRight: '1px solid var(--grey-shadow)' }}
                          >
                            {dataItem.cla_valor}
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{ backgroundColor: index % 2 === 0 ? 'white' : 'var(--body-background)', borderRight: '1px solid var(--grey-shadow)' }}
                          >
                            {dataItem.pdvs[0].pdv_nome}
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{ backgroundColor: index % 2 === 0 ? 'white' : 'var(--body-background)' }}
                          >
                            <TextField
                              id={`dinheiro-${index}`}
                              label="Valor R$"
                              variant="outlined"
                              value={dataItem.pdvs[0].taxa.tax_dinheiro}
                              onChange={(e) => handleTextFieldChange(e, index, 'dinheiro')}
                            />
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{ backgroundColor: index % 2 === 0 ? 'white' : 'var(--body-background)', borderRight: '1px solid var(--grey-shadow)' }}
                          >
                            <Checkbox />
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{ backgroundColor: index % 2 === 0 ? 'white' : 'var(--body-background)' }}
                          >
                            <TextField
                              id={`credito-${index}`}
                              label="Valor R$"
                              variant="outlined"
                              value={dataItem.pdvs[0].taxa.tax_credito}
                              onChange={(e) => handleTextFieldChange(e, index, 'credito')}
                            />
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{ backgroundColor: index % 2 === 0 ? 'white' : 'var(--body-background)', borderRight: '1px solid var(--grey-shadow)' }}
                          >
                            <Checkbox />
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{ backgroundColor: index % 2 === 0 ? 'white' : 'var(--body-background)' }}
                          >
                            <TextField
                              id={`debito-${index}`}
                              label="Valor R$"
                              variant="outlined"
                              value={dataItem.pdvs[0].taxa.tax_debito}
                              onChange={(e) => handleTextFieldChange(e, index, 'debito')}
                            />
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{ backgroundColor: index % 2 === 0 ? 'white' : 'var(--body-background)', borderRight: '1px solid var(--grey-shadow)' }}
                          >
                            <Checkbox />
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{ backgroundColor: index % 2 === 0 ? 'white' : 'var(--body-background)' }}
                          >
                            <TextField
                              id={`pix-${index}`}
                              label="Valor R$"
                              variant="outlined"
                              value={dataItem.pdvs[0].taxa.tax_pix}
                              onChange={(e) => handleTextFieldChange(e, index, 'pix')}
                            />
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{ backgroundColor: index % 2 === 0 ? 'white' : 'var(--body-background)', borderRight: '1px solid var(--grey-shadow)' }}
                          >
                            <Checkbox />
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{ backgroundColor: index % 2 === 0 ? 'white' : 'var(--body-background)', borderRight: '1px solid var(--grey-shadow)' }}
                          >
                            <TextField
                              id={`parcela-${index}`}
                              label="Parcelas"
                              type="number"
                              variant="outlined"
                              value={dataItem.pdvs[0].parcela.par_max}
                              onChange={(e) => handleTextFieldChange(e, index, 'parcela')}
                            />
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{ backgroundColor: index % 2 === 0 ? 'white' : 'var(--body-background)' }}
                          >
                            <TextField
                              id={`taxa-${index}`}
                              label="Valor R$"
                              variant="outlined"
                              value={dataItem.pdvs[0].parcela.par_acrescimo}
                              onChange={(e) => handleTextFieldChange(e, index, 'taxa')}
                            />
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{ backgroundColor: index % 2 === 0 ? 'white' : 'var(--body-background)' }}
                          >
                            <Checkbox />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <StyledTableCell colSpan={10} align="center">
                          Selecione um evento
                        </StyledTableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}