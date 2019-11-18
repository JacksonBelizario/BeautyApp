import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {Snackbar, IconButton, SnackbarContent} from "@material-ui/core";
import {green, amber} from '@material-ui/core/colors';
import {withStyles} from '@material-ui/core/styles';
import {
	AlertCircle as ErrorIcon,
	AlertTriangle as WarningIcon,
    CheckCircle as CheckCircleIcon,
	Info as InfoIcon,
	X as CloseIcon
} from 'react-feather';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const styles = theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.danger.dark,
  },
  info: {},
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});

const SnackbarComponent = ({ classes, className, message, onClose, variant, ...other }) => {
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

SnackbarComponent.propTypes = {
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};

const SnackBarMain = withStyles(styles)(SnackbarComponent);

const SnackbarWrapper = ({showSnackBar, dispatch}) => {

  const closeSnackBar = (event, reason) => {
      if (reason === 'clickaway') {
          return;
      }

      dispatch({
          type: 'SNACKBAR',
          show: false,
          message: ''
      })
  }

  return (
    <Snackbar
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        open={showSnackBar.show}
        autoHideDuration={3000}
        onClose={closeSnackBar}
        >
        <SnackBarMain
            onClose={closeSnackBar}
            variant={showSnackBar.variant}
            message={showSnackBar.message}
        />
    </Snackbar>);
};

export default connect(state => ({
  showSnackBar: {
      message: state.showSnackBar.message,
      variant: state.showSnackBar.variant,
      show: state.showSnackBar.show,
  }
}))(SnackbarWrapper);