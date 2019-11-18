import React, { Fragment, useState } from 'react';
import { Avatar, IconButton , Fade, Menu, MenuItem } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { userQuery } from '../../api/users';
import { RouterPaths } from '../../routes';
import {User as UserIcon} from 'react-feather';

const avatarImage = (size, email) =>
    `https://api.adorable.io/avatars/${size}/${email}.png`;

const exit = () =>
  Meteor.logout(error => {
    if (error) {
      throw new Error(`Usuário não desconectado: ${error}`);
    }

    window.location = '/';
  });

const BarAvatarComponent = ({ userData: { user = {} } }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  console.log('UserAvatar', user);
  const { name, email } = user;

  const handleClose = () => setAnchorEl(null);

  return (
    <Fragment>
      {/* <Avatar
        alt={name}
        src={avatarImage(64, email)}
        onClick={e => setAnchorEl(e.currentTarget)}
      /> */}
      <IconButton
        aria-haspopup="true"
        color="inherit"
        onClick={e => setAnchorEl(e.currentTarget)}>
        <UserIcon />
      </IconButton>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        TransitionComponent={Fade}
        disableAutoFocusItem
      >
        <MenuItem
          onClick={handleClose}
          component={Link}
          to={RouterPaths.USER_PROFILE}
        >
          Perfil
        </MenuItem>
        <MenuItem onClick={exit}>Sair</MenuItem>
      </Menu>
    </Fragment>
  );
};

export const BarAvatar = userQuery(BarAvatarComponent);
