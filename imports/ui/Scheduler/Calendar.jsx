import React, {useState} from 'react';
import { compose } from 'recompose';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from '../../utils/moment'
import {
    Button, TextField, Grid, Dialog, DialogActions, DialogContent, 
    DialogContentText, DialogTitle, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio
} from '@material-ui/core';
import { withStyles } from '@material-ui/core';
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
const localizer = momentLocalizer(moment) // or globalizeLocalizer

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

const stEnum = {
    RESERVADO: 0,
    CANCELADO: 1,
    ATENDENDO: 2,
    FINALIZADO: 3
}

const statusColor = ['#ffb822', '#f4516c', '#5867dd', '#34bfa3'];

const style = theme => ({
    statusCheckBox: {
        justifyContent: "center"
    },
    reservado: {
        color: statusColor[stEnum.RESERVADO],
        '&$checked': {
            color: statusColor[stEnum.RESERVADO],
        },
    },
    cancelado: {
        color: statusColor[stEnum.CANCELADO],
        '&$checked': {
            color: statusColor[stEnum.CANCELADO],
        },
    },
    atendendo: {
        color: statusColor[stEnum.ATENDENDO],
        '&$checked': {
            color: statusColor[stEnum.ATENDENDO],
        },
    },
    finalizado: {
        color: statusColor[stEnum.FINALIZADO],
        '&$checked': {
            color: statusColor[stEnum.FINALIZADO],
        },
    },
    checked: {},
});

const MyCalendar = ({classes, eventsData: { events, loading }, createEvent, editEvent, removeEvent}) => {

    events = events || [];
    if (loading) {
      return <Loading />;
    }

    console.log({events});

    const [title, setTitle] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [desc, setDesc] = useState("");
    const [employee, setEmployee] = useState("");
    const [customer, setCustomer] = useState("");
    const [service, setService] = useState("");
    const [status, setStatus] = useState(stEnum.RESERVADO);
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
      setStatus(0);
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
        setStatus(event.status || stEnum.RESERVADO);
    }

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
                        status,
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
                        status,
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

    const eventStyleGetter = (event, start, end, isSelected) => {
        return {
            style: {
                backgroundColor: statusColor[parseInt(event.status || stEnum.RESERVADO)],
                opacity: 0.8,
                color: 'black',
            }
        };
    };

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
            setEnd(moment(date).add(service.duration || 0, 'minutes'));
        }
    };
    
    const handleEndTime = (date) => {
        setEnd(date);
    };

    const handleStatus = ({target: {value}}) => {
        console.log("handleStatus", {value});
        setStatus(value);
    };


    return (<MuiPickersUtilsProvider utils={MomentUtils}>
        <Paper>
            <Calendar
                localizer={localizer}
                showMultiDayTimes
                titleAccessor={ev => ev.service ? ev.service.name :  "serviço"}
                startAccessor={ev => moment(ev.start).toDate()}
                endAccessor={ev => moment(ev.end).toDate()}
                events={events}
                views={["month", "week", "day", "agenda"]}
                messages={messages}
                timeslots={2}
                defaultView="month"
                defaultDate={new Date()}
                selectable
                onSelectEvent={handleEventSelected}
                onSelectSlot={handleSlotSelected}
                eventPropGetter={(eventStyleGetter)}
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
                        <FormControl component="fieldset" fullWidth>
                            <RadioGroup row
                                className={classes.statusCheckBox} 
                                aria-label="status" 
                                name="status" 
                                value={status} 
                                onChange={handleStatus}>
                                <FormControlLabel
                                    className={classes.reservado}
                                    value="0" control={<Radio classes={{root: classes.reservado, checked: classes.checked}} />}
                                    label="Reservado"
                                    labelPlacement="top" />
                                <FormControlLabel
                                    className={classes.cancelado}
                                    value="1"
                                    control={<Radio classes={{root: classes.cancelado, checked: classes.checked}} />}
                                    label="Cancelado"
                                    labelPlacement="top" />
                                <FormControlLabel
                                    className={classes.atendendo}
                                    value="2"
                                    control={<Radio classes={{root: classes.atendendo, checked: classes.checked}} />}
                                    label="Atendendo"
                                    labelPlacement="top" />
                                <FormControlLabel
                                    className={classes.finalizado}
                                    value="3"
                                    control={<Radio classes={{root: classes.finalizado, checked: classes.checked}} />}
                                    label="Finalizado"
                                    labelPlacement="top" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
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
    withStyles(style),
    eventsQuery, createEventMutation, editEventMutation, removeEventMutation
)(MyCalendar);