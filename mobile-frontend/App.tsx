/**
 * Green Rides Mobile App
 * @format
 */

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { useDispatch } from 'react-redux';
import AppNavigator from './src/navigation/AppNavigator';
import { loadTokenFromStorage } from './src/redux/slices/authSlice';

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // @ts-ignore
    dispatch(loadTokenFromStorage());
  }, [dispatch]);

  return <AppNavigator />;
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
