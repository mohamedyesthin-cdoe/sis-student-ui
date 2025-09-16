import AppRoutes from './routes/AppRoutes';
import { Provider } from 'react-redux';
import { store } from "./redux/Store";
import { useEffect, useState } from 'react';
import { loaderStore } from './redux/LoaderStore';
import Loader from './components/loader/Loader';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './styles/theme';


function App() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loaderStore.setHandler(setLoading);
  }, []);

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




