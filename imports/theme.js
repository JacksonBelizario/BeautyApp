import { createMuiTheme } from '@material-ui/core/styles';
import { blue, purple, red, green } from '@material-ui/core/colors';

const theme = createMuiTheme({
    palette: {
        primary: { light: purple[600], main: purple[700], dark: purple[900] },
        secondary: { light: red[400], main: red[600], dark: red[800] },
        success: { light: green[300], main: green[500], dark: green[700] },
        info: { light: blue[300], main: blue[500], dark: blue[700] },
        danger: { light: red[300], main: red[500], dark: red[700] },
    },

    typography: {
        fontFamily: 'Rubik',
        useNextVariants: true,
    },

    spacingField: {
        margin: '8px',
    },

    mainBackground: {
        backgroundColor: '#fafafa',
    },

    backgroundButtonFacebook: {
        backgroundColor: '#557cf2',
    },

    backgroundButtonGoogle: {
        backgroundColor: '#DE4C33',
    },
    
    boxShadow: '0 4px 20px 0 rgba(0,0,0,.05)'
});

export default theme;