import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { DDPLink } from 'meteor/swydo:ddp-apollo';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { BrowserRouter } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import { store } from '../imports/store';
import ApolloClient from 'apollo-client';
import App from '/imports/ui/App.jsx';
import theme from '../imports/theme.js'

const client = new ApolloClient({
  link: new DDPLink(),
  cache: new InMemoryCache(),
});

Meteor.startup(() => {
  render(
      <BrowserRouter>
          <ApolloProvider client={client}>
              <MuiThemeProvider theme={theme}>
                  <Provider store={store} >
                    <App/>
                  </Provider>
              </MuiThemeProvider>
          </ApolloProvider>
      </BrowserRouter>,
      document.getElementById('app'));
});
