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
    <div>
      {eventOptions.map((option) => (
        <div key={option.value}>
          <h3>{option.label}</h3>
          {option.data?.map((pdv) => (
            <div key={pdv.pdvs[0].pdv_id}>
              <p>Nome do PDV: {pdv.pdvs[0].pdv_nome}</p>
              <p>Taxa em dinheiro: {pdv.taxa?.tax_dinheiro}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  ); 
}