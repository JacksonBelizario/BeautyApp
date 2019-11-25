import React, {useState} from 'react';
import { compose } from 'recompose';
import BigCalendar from 'react-big-calendar'
import moment from '../../utils/moment'
import {
    Button, TextField, Grid,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@material-ui/core';
import CustomerSelect from './components/CustomerSelect';
import EmployeeSelect from './components/EmployeeSelect';
import ServiceSelect from './components/ServiceSelect';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Paper from '../components/Paper.jsx';
import Loading from '../components/Loading';
import { eventsQuery, createEventMutation, editEventMutation, removeEventMutation } from '../../api/events';

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

const MyCalendar = ({eventsData: { events, loading }, createEvent, editEvent, removeEvent}) => {

    events = events || [];
    if (loading) {
      return <Loading />;
    }

    // const [events, setEvents] = useState([]);
    const [title, setTitle] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [desc, setDesc] = useState("");
    const [employee, setEmployee] = useState({});
    const [customer, setCustomer] = useState({});
    const [service, setService] = useState({});
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
      setTitle("");
      setDesc("");
      setStart(slotInfo.start);
      setEnd(slotInfo.end);
      setOpenSlot(true);
    }

    const handleEventSelected = (event) => {
        setOpenEvent(true);
        setClicketEvent(event);
        setStart(event.start);
        setEnd(event.end);
        setTitle(event.title);
        setDesc(event.desc);
        setCustomer(event.customer);
        setEmployee(event.employee);
        setService(event.service);
        console.log("handleEventSelected", { service: event.service });
        console.log("handleEventSelected2", { service });
    }
    console.log({ service });

    // Onclick callback function that pushes new appointment into events array.
    const setNewAppointment = async () => {
        try {
            const { data } = await createEvent({
                variables: {
                    event: {
                        start: moment(start).format(moment.HTML5_FMT.DATETIME_LOCAL),
                        end: moment(end).format(moment.HTML5_FMT.DATETIME_LOCAL),
                        title,
                        desc,
                        employeeId: employee._id,
                        customerId: customer._id,
                        serviceId: service._id
                    }
                },
            });
            console.log('setNewAppointment', {data});
        } catch (e) {
            console.log('erro', e);
        }
    }
  
    //  Updates Existing Appointments Title and/or Description
    const updateEvent = async () => {
        try {
            const { data } = await editEvent({
                variables: {
                    id: clickedEvent._id,
                    event: {
                        start: moment(start).format(moment.HTML5_FMT.DATETIME_LOCAL),
                        end: moment(end).format(moment.HTML5_FMT.DATETIME_LOCAL),
                        title,
                        desc,
                        employeeId: employee._id,
                        customerId: customer._id,
                        serviceId: service._id
                    },
                },
            });
            console.log('updateEvent', {data});
        } catch (e) {
            console.log('erro', e);
        }
    }
  
    //  filters out specific event that is to be deleted and set that variable to state
    const deleteEvent = async () => {
        try {
            const { data } = await removeEvent({ variables: { id: clickedEvent._id } } );
            if (data.removeEvent) {
                console.log(data);
            }
        } catch(erro) {
            console.log('erro', erro);
        }
    }

    const handleEmployeeSelect = (value) => {
        setEmployee(value);
    };

    const handleCustomerSelect = (value) => {
        setCustomer(value);
    };

    const handleServiceSelect = (value) => {
        setService(value);
        setEnd(moment(start).add(value.duration || 0, 'minutes'));
    };

    const handleDesc = ({target: {value}}) => {
        setDesc(value);
    };

    const handleStartTime = (date) => {
        setStart(date);
        if (!!service) {
            setEnd(moment(start).add(service.duration || 0, 'minutes'));
        }
      };
    
      const handleEndTime = (date) => {
          setEnd(date);
      };


    return (<MuiPickersUtilsProvider utils={MomentUtils}>
        <Paper>
            <BigCalendar
                localizer={localizer}
                titleAccessor={ev => ev.service ? ev.service.name :  "serviço"}
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
            <DialogTitle id="form-dialog-title">
                Agendar em: {moment(start).format("LL")}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <EmployeeSelect onChange={handleEmployeeSelect} />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomerSelect onChange={handleCustomerSelect} />
                    </Grid>
                    <Grid item xs={12}>
                        <ServiceSelect onChange={handleServiceSelect} />
                    </Grid>
                    {/* <TextField
                        autoFocus
                        margin="dense"
                        label="Título"
                        fullWidth
                        value={title}
                        onChange={({target: {value}}) => {
                            setTitle(value);
                        }}
                    /> */}
                    <Grid item xs={12}>
                        <TextField
                            label="Descrição"
                            fullWidth
                            value={desc}
                            onChange={handleDesc}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TimePicker
                            margin="normal"
                            label="Hora Inicial"
                            cancelLabel="CANCELAR"
                            ampm={false}
                            value={start}
                            onChange={handleStartTime}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TimePicker
                            margin="normal"
                            label="Hora Final"
                            cancelLabel="CANCELAR"
                            ampm={false}
                            value={end}
                            // onChange={handleEndTime}
                            fullWidth
                            disabled={true}
                        />
                    </Grid>
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
            <DialogTitle id="form-dialog-edit-title">
                Ver/Editar agendamento: {moment(start).format("LL")}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <EmployeeSelect
                            defaultValue={employee}
                            onChange={handleEmployeeSelect} />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomerSelect
                            defaultValue={customer}
                            onChange={handleCustomerSelect} />
                    </Grid>
                    <Grid item xs={12}>
                        <ServiceSelect
                            defaultValue={service}
                            onChange={handleServiceSelect} />
                    </Grid>
                    {/* <TextField
                        autoFocus
                        margin="dense"
                        label="Título"
                        value={title}
                        fullWidth
                        onChange={({target: {value}}) => {
                            setTitle(value);
                        }}
                    /> */}
                    <Grid item xs={12}>
                        <TextField
                            label="Descrição"
                            value={desc}
                            fullWidth
                            onChange={handleDesc}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TimePicker
                            margin="normal"
                            label="Hora Inicial"
                            cancelLabel="CANCELAR"
                            ampm={false}
                            value={start}
                            onChange={handleStartTime}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TimePicker
                            margin="normal"
                            label="Hora Final"
                            cancelLabel="CANCELAR"
                            ampm={false}
                            value={end}
                            // onChange={handleEndTime}
                            fullWidth
                            disabled={true}
                        />
                    </Grid>
                </Grid>
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

export default compose(
    eventsQuery, createEventMutation, editEventMutation, removeEventMutation
)(MyCalendar);