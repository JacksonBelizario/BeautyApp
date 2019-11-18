import React, { useState } from 'react';
import {compose} from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import { withRouter } from 'react-router-dom';
import {config} from '../../config.js';
import {
    User as UserIcon,
    Layers as LayersIcon,
    Circle as CircleIcon,
    ChevronDown as ChevronDownIcon,
    ChevronRight as ChevronRightIcon
} from 'react-feather';
import { MakeUpMirror } from '../../icons.js';

import {RouterPaths} from '../../routes';

const styles = theme => ({
    list: {
        width: 250,
    },
    nested: {
      margin: [[0, 20, 0, 4], '!important'],
    },
});

const menu = [
    {
        type: "list",
        list: [
            {
                title: config.appName,
                to: RouterPaths.ROOT,
                icon: <MakeUpMirror/>
            }
        ]
    },
    {
        type: "divider"
    },
    {
        type: "list",
        list: [
            {
                title: 'Perfil',
                to: RouterPaths.USER_PROFILE,
                icon: <UserIcon/>
            },
        ]
    },
    {
        type: "nested",
        icon: <LayersIcon/>,
        title: 'Cadastros',
        open: true,
        list: [
            {
                title: 'Funcionários',
                to: RouterPaths.EMPLOYEES,
            },
            {
                title: 'Clientes',
                to: RouterPaths.CUSTOMERS,
            },
            {
                title: 'Serviços',
                to: RouterPaths.SERVICES,
            },
            {
                title: 'Produtos',
                to: RouterPaths.PRODUCTS,
            },
        ]
    },
    {
        type: "divider"
    },
];

const SidebarComponent = ({classes, history, showDrawer, setShowDrawer}) => {
    const [list, setList] = useState(menu);

    const handleOpen = (index, open) => {
        setList({
            ...list,
            [index]: {
                ...list[index],
                open
            }
        });
    };

    const handleClick = to => {
        setShowDrawer(false);
        history.replace();
        history.push(to);
    };

    const sideList = (
        <div className={classes.list}>
        {menu.map((item, index) => {
            if (item.type === "list") {
                return (<List key={index}>
                    {item.list.map(({title, to, icon}, index) => (
                        <ListItem button key={index} onClick={() => { handleClick(to) }}>
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText primary={title}/>
                        </ListItem>
                    ))}
                </List>);
            } else if (item.type === "divider") {
                return <Divider key={index}/>;
            } else if (item.type === "nested") {
                return (<div key={index}>
                    <ListItem button onClick={() => { handleOpen(index, !list[index].open) }}>
                        <ListItemIcon>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText inset primary={item.title} />
                        {list[index].open ? <ChevronDownIcon size={16} /> : <ChevronRightIcon size={16} />}
                    </ListItem>
                    <Collapse in={list[index].open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {item.list.map(({title, to, icon}, index) => (
                            <ListItem button key={index} onClick={() => { handleClick(to) }}>
                                <ListItemIcon className={classes.nested}><CircleIcon size={16} /></ListItemIcon>
                                <ListItemText primary={title}/>
                            </ListItem>
                        ))}
                    </List>
                </Collapse>
                </div>);
            }
        })}
        </div>
    );

    return (
        <div>
            <SwipeableDrawer
                open={showDrawer}
                onClose={() => {
                    setShowDrawer(false)
                }}
                onOpen={() => {
                    setShowDrawer(true)
                }}
            >
                <div
                    tabIndex={0}
                    role="button"
                    onKeyDown={() => {
                        setShowDrawer(false)
                    }}
                >
                    {sideList}
                </div>
            </SwipeableDrawer>
        </div>
    );
};

export const Sidebar = compose(
    withRouter,
    withStyles(styles)
)(SidebarComponent);