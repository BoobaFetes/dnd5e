import { ApolloProvider } from '@apollo/client';
import { client } from '@boobafetes/dnd5e-api';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import './styles.scss';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

root.render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </ThemeProvider>
  </BrowserRouter>
);
