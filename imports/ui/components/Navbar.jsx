import React, {useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {compose} from 'recompose';
import {AppBar, Badge, Button, IconButton, Toolbar, Typography} from '@material-ui/core';
import {BarAvatar} from '../User/BarAvatar.jsx';
import {RouterPaths} from '../../routes';
import {Link, withRouter} from 'react-router-dom';
import {Sidebar} from './Sidebar';
import {config} from '../../config.js';
import {
    Menu as MenuIcon,
    Mail as MailIcon,
    Bell as NotificationsIcon,
} from 'react-feather';

const styles = theme => ({
    root: {
        // flexGrow: 1,
        margin: theme.spacing.unit,
    },
    appBar: {
        borderRadius: '8px',
        backgroundColor: '#fff',
        color: theme.palette.primary.main,
        boxShadow: theme.boxShadow
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    flex: {
        display: 'flex',
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'block',
      },
    },
});

function ButtonAppBar({classes, location: {pathname}}) {
    const [showDrawer, setShowDrawer] = useState(false);
    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        className={classes.menuButton}
                        onClick={() => setShowDrawer(true)}
                        color="inherit"
                        aria-label="Menu"
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h5" color="inherit" className={classes.grow}>
                        {config.appName}
                    </Typography>
                    {Meteor.userId() ? (<div>
                            <div className={classes.flex}>
                                <IconButton color="inherit" className={classes.sectionDesktop}>
                                    <Badge badgeContent={4} color="secondary">
                                        <MailIcon />
                                    </Badge>
                                </IconButton>
                                <IconButton color="inherit" className={classes.sectionDesktop}>
                                    <Badge badgeContent={17} color="secondary">
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>
                                <BarAvatar/>
                            </div>
                        </div>
                    ) : pathname !== '/login' ? (
                        <Button
                            component={Link}
                            to={RouterPaths.LOGIN}
                            color="inherit"
                            variant="outlined"
                        >
                            Login
                        </Button>
                    ) : ''}
                </Toolbar>
            </AppBar>
            <Sidebar showDrawer={showDrawer} setShowDrawer={setShowDrawer}/>
        </div>
    );
}

export const Navbar = compose(
    withRouter,
    withStyles(styles)
)(ButtonAppBar);