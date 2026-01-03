
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store.ts';
import App from './App.tsx';
import NotificationContainer from './components/NotificationContainer.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <NotificationContainer />
      <App />
    </Provider>
  </React.StrictMode>
);
