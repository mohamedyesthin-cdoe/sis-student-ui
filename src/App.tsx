import AppRoutes from './routes/AppRoutes';
import { Provider } from 'react-redux';
import { store } from "./redux/Store";
import { useEffect, useState } from 'react';
import { loaderStore } from './redux/LoaderStore';
import Loader from './components/loader/Loader';

function App() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loaderStore.setHandler(setLoading);
  }, []);

  return (
    <Provider store={store}>
      {loading && (
        <Loader />
      )}
      <AppRoutes />
    </Provider>
  );
}

export default App;
