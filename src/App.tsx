import AppRoutes from './routes/AppRoutes';
import { Provider } from 'react-redux';
import { store } from "./redux/Store";
import Loader from './components/loader/Loader';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './styles/theme';
import { useLoader } from './context/LoaderContext';


function App() {
  const { loading } = useLoader();
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {loading && <Loader />}
        <AppRoutes />
      </ThemeProvider>
    </Provider>
  );
}

export default App;




