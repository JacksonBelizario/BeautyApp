import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
    boxShadow: theme.boxShadow
  },
});


export default withStyles(styles)(
    ({classes, children, ...props}) => (
        <Paper
          {...props}
          className={classes.paper}
          elevation={0}
        >{children}</Paper>
    )
);