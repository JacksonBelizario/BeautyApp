import React, { Fragment, useState } from 'react';
import { compose } from 'recompose';
import {
    Grid, Paper, IconButton, InputBase, Link, Card, CardHeader, CardContent,
    List, ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction,
    Avatar, Typography
} from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar'
import Loading from '../components/Loading';
import { servicesQuery, removeServiceMutation } from '../../api/services';
import { Service } from './Service.jsx';

import {
    PlusCircle as PlusCircleIcon,
    Edit2 as EditIcon,
    Trash as RemoveIcon,
    Loader as LoaderIcon
} from 'react-feather';

const styles = theme => ({
    box: {
        backgroundColor: '#fff',
        boxShadow: theme.boxShadow,
        height: 'calc(100vh - 120px)'
    },
    appSidebar: {
        height: '100%',
        borderRight: '1px solid #eee',
    },
    appDetails: {
        height: '100%',
        padding: '20px 25px',
    },
    spacing: {
        padding: '20px 25px',
    },
    search: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #eee',
        borderRadius: '24px',
    },
    input: {
        marginLeft: 8,
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    add: {
        color: theme.palette.primary.main,
    },
    listContainer: {
        height: '86%',
    },
    list: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: 'inline',
    },
    actions: {
        height: '100%',
        marginTop: 4,
        marginRight: 10,
    },
    edit: {
        color: theme.palette.info.main
    },
    remove: {
        color: theme.palette.danger.main
    },
    card: {
    },
    cardMedia: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    cardActions: {
      display: 'flex',
    },
    cardExpand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    cardExpandOpen: {
      transform: 'rotate(180deg)',
    },
    cardAvatar: {
        margin: 10,
        width: 100,
        height: 100,
    },
});


const Services = ({classes, servicesData: { services, loading }, removeService}) => {

    if (loading) {
      return <Loading />;
    }

    const [active, setActive] = useState(-1);
    const [initial, setInitial] = useState({});
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const servicos = services
    .filter(el => search ? el.name.toLowerCase().includes(search.toLowerCase()) : el);

    const remove = async (id) => {
        console.log('remove', id);
        try {
            const { data } = await removeService({ variables: { id } } );
            if (data.removeService) {
                console.log(data);
            }
        } catch(erro) {
            console.log('erro', erro);
        }
    }

    const addService = () => {
        setInitial({_id: 0, name: '', amount: 0, duration: 0});
        setOpen(true);
    }

    const editService = (data) => {
        setInitial(data);
        setOpen(true);
    }

    return (
        <Grid container className={classes.box}>
            {
                open
                ? <Service open={open} setOpen={setOpen} initial={initial} />
                : ''
            }
            <Grid item xs={12} sm={5} className={classes.appSidebar}>
                <Grid container className={classes.spacing} alignItems="center">
                    <Grid item xs>
                        <Paper className={classes.search} elevation={0}>
                            <InputBase className={classes.input} placeholder="Procurar" value={search} onChange={({target: { value } }) => setSearch(value)} />
                            <IconButton className={classes.iconButton} aria-label="Procurar">
                                <SearchIcon />
                            </IconButton>
                        </Paper>
                    </Grid>
                    <Grid item>
                        <IconButton className={classes.iconButton} aria-label="Adicionar" onClick={() => addService()}>
                            <PlusCircleIcon className={classes.add} />
                        </IconButton>
                    </Grid>
                </Grid>
                <div className={classes.listContainer}>
                    <PerfectScrollbar>
                        <List className={classes.list}>
                        {
                            servicos
                                .map((el, index) => (
                                <ListItem
                                    button
                                    onClick={() => setActive(index)}
                                    alignItems="flex-start"
                                    key={index}>
                                    <ListItemAvatar>
                                        <Avatar style={{backgroundColor: '#7200ca'}} >{el.name && el.name.split(' ').slice(0, 2).map(letters => letters[0]).join('')}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={el.name}
                                        secondary={
                                            <Fragment>
                                                Duração: {el.duration}
                                            </Fragment>
                                        }
                                    />
                                    <ListItemSecondaryAction className={classes.actions}>
                                        <Grid container
                                            direction="column"
                                            justify="center"
                                            alignItems="center"
                                            spacing={8} >
                                            <Grid item>
                                                <Link
                                                    aria-label="Editar"
                                                    component="button"
                                                    className={classes.edit} 
                                                    onClick={() => editService(el)}>
                                                    <EditIcon size={16} />
                                                </Link>
                                            </Grid>
                                            <Grid item>
                                                <Link
                                                    aria-label="Remover"
                                                    component="button"
                                                    className={classes.remove}
                                                    onClick={() => remove(el._id)}>
                                                    <RemoveIcon size={16} />
                                                </Link>
                                            </Grid>
                                        </Grid>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))
                        }
                        </List>
                    </PerfectScrollbar>
                </div>
            </Grid>
            <Grid item xs={12} sm={7}>
            {
                (active > -1) ? (
                    <Card className={classes.card} elevation={0}>
                        <CardHeader
                            className={classes.cardHeader}
                            avatar={
                                <Avatar>{servicos[active].name && servicos[active].name.split(' ').slice(0, 2).map(letters => letters[0]).join('')}</Avatar>
                            }
                            action={
                            <IconButton className={classes.edit} onClick={() => editService(servicos[active])}>
                                <EditIcon />
                            </IconButton>
                            }
                            title={
                                <Typography variant="h5">
                                    {servicos[active].name}
                                </Typography>
                            }
                        />
                        <CardContent>
                            <Grid container
                                direction="column"
                                justify="flex-start"
                                alignItems="flex-start"
                                spacing={16} >
                                <Grid item container spacing={16}>
                                    <Grid item xs={4} md={3}><b>Nome:</b></Grid>
                                    <Grid item xs={8} md={9}>{servicos[active].name}</Grid>
                                </Grid>
                                <Grid item container spacing={16}>
                                    <Grid item xs={4} md={3}><b>Valor:</b></Grid>
                                    <Grid item xs={8} md={9}>{servicos[active].amount}</Grid>
                                </Grid>
                                <Grid item container spacing={16}>
                                    <Grid item xs={4} md={3}><b>Duração:</b></Grid>
                                    <Grid item xs={8} md={9}>{servicos[active].duration}</Grid>
                                </Grid>
                            </Grid>
                        </CardContent>
                        </Card>
                    )
                : (
                    <Grid container
                        className={classes.appDetails}
                        direction="column"
                        justify="center"
                        alignItems="center"
                        spacing={24} >
                        <Grid item>
                            <LoaderIcon size={124}  />
                        </Grid>
                        <Grid item>
                            <Typography variant="h5">
                                Selecione um serviço para visualizar mais detalhes
                            </Typography>
                        </Grid>
                    </Grid>
                )
            }
            </Grid>
        </Grid>
    )
}

export default compose(
    servicesQuery,
    removeServiceMutation,
    withStyles(styles)
)(Services);