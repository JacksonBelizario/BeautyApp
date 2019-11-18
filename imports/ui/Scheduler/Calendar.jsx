import React, {useState} from 'react';
import BigCalendar from 'react-big-calendar'
import moment from '../../utils/moment'
import {
    Button, TextField, Grid,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@material-ui/core';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, TimePicker } from 'material-ui-pickers';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Paper from '../components/Paper.jsx';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

const messages = {
    date: 'Data',
    time: 'Hora',
    event: 'Evento',
    allDay: 'Dia todo',
    week: 'Semana',
    work_week: 'Work Week',
    day: 'Dia',
    month: 'Mês',
    previous: 'Anterior',
    next: 'Próximo',
    yesterday: 'Ontem',
    tomorrow: 'Amanhã',
    today: 'Hoje',
    agenda: 'Agenda',
  
    noEventsInRange: 'Não há eventos para o período escolhido.',
  
    showMore: total => `Mostrar +${total}`,
  }

const MyCalendar = props => {
    const [events, setEvents] = useState([]);
    const [title, setTitle] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [desc, setDesc] = useState("");
    const [openSlot, setOpenSlot] = useState(false);
    const [openEvent, setOpenEvent] = useState(false);
    const [clickedEvent, setClicketEvent] = useState({});

    // Fecha os modais
    const handleClose = () => {
        setOpenSlot(false);
        setOpenEvent(false);
    }

    //  Allows user to click on calendar slot and handles if appointment exists
    const handleSlotSelected = (slotInfo) => {
      console.log("Real slotInfo", slotInfo);
      setTitle("");
      setDesc("");
      setStart(slotInfo.start);
      setEnd(slotInfo.end);
      setOpenSlot(true);
    }

    const handleEventSelected = (event) => {
        console.log("event", event);
        setOpenEvent(true);
        setClicketEvent(event);
        setStart(event.start);
        setEnd(event.end);
        setTitle(event.title);
        setDesc(event.desc);
    }

    // Onclick callback function that pushes new appointment into events array.
    const setNewAppointment = () => {
      // localStorage.setItem("cachedEvents", JSON.stringify(events));
      setEvents([...events, { title, start, end, desc }]);
    }
  
    //  Updates Existing Appointments Title and/or Description
    const updateEvent = () => {
      const index = events.findIndex(event => event === clickedEvent);
      const updatedEvent = [...events];
      updatedEvent[index] = { title, start, end, desc };
      // localStorage.setItem("cachedEvents", JSON.stringify(updatedEvent));
      setEvents(updatedEvent);
    }
  
    //  filters out specific event that is to be deleted and set that variable to state
    const deleteEvent = () => {
      let updatedEvents = events.filter(
        event => event.start !== start
      );
      // localStorage.setItem("cachedEvents", JSON.stringify(updatedEvents));
      setEvents(updatedEvents);
    }

    const handleStartTime = (date) => {
        setStart(date);
      };
    
    const handleEndTime = (date) => {
        setEnd(date);
    };


    return (<MuiPickersUtilsProvider utils={MomentUtils}>
        <Paper>
            <BigCalendar
                localizer={localizer}
                events={events}
                views={["month", "week", "day", "agenda"]}
                messages={messages}
                timeslots={2}
                defaultView="month"
                defaultDate={new Date()}
                selectable
                onSelectEvent={handleEventSelected}
                onSelectSlot={handleSlotSelected}
            />
        </Paper>
        {/* Material-ui Modal for booking new appointment */}
        <Dialog open={openSlot} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Agendar em: {moment(start).format(
                    "DD MMMM, YYYY"
                )}</DialogTitle>
            <DialogContent>
            <Grid container direction="column">
                <TextField
                    autoFocus
                    margin="dense"
                    label="Título"
                    fullWidth
                    onChange={({target: {value}}) => {
                        setTitle(value);
                    }}
                />
                <TextField
                    label="Descrição"
                    fullWidth
                    onChange={({target: {value}}) => {
                        setDesc(value);
                    }}
                />
                <TimePicker
                    margin="normal"
                    label="Hora Inicial"
                    cancelLabel="CANCELAR"
                    ampm={false}
                    value={start}
                    onChange={handleStartTime}
                />
                <TimePicker
                    margin="normal"
                    label="Hora Final"
                    cancelLabel="CANCELAR"
                    ampm={false}
                    value={end}
                    onChange={handleEndTime}
                />
            </Grid>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>
                Cancelar
            </Button>
            <Button color="primary"
                onClick={() => {
                    setNewAppointment(), handleClose();
                }}>
                Salvar
            </Button>
            </DialogActions>
        </Dialog>

        {/* Material-ui Modal for Existing Event */}
        <Dialog open={openEvent} onClose={handleClose} aria-labelledby="form-dialog-edit-title">
            <DialogTitle id="form-dialog-edit-title">Ver/Editar agendamento: {moment(start).format(
                    "DD MMMM, YYYY"
                )}</DialogTitle>
            <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label="Título"
                fullWidth
                onChange={({target: {value}}) => {
                    setTitle(value);
                }}
            />
            <br />
            <TextField
                label="Descrição"
                fullWidth
                onChange={({target: {value}}) => {
                    setDesc(value);
                }}
            />
            <TimePicker
                margin="normal"
                label="Hora Inicial"
                cancelLabel="CANCELAR"
                ampm={false}
                value={start}
                onChange={handleStartTime}
            />
            <TimePicker
                margin="normal"
                label="Hora Final"
                cancelLabel="CANCELAR"
                ampm={false}
                value={end}
                onChange={handleEndTime}
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>
                Cancelar
            </Button>
            <Button
                color="secondary"
                onClick={() => {
                    deleteEvent(), handleClose();
                }}>
                Remover
            </Button>
            <Button color="primary"
                onClick={() => {
                    updateEvent(), handleClose();
                }}>
                Confirmar edição
            </Button>
            </DialogActions>
        </Dialog>
    </MuiPickersUtilsProvider>);
  };

export default MyCalendar;