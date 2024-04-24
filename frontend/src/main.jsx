import React from 'react'
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store.js';
import App from './App.jsx'
import './index.css';
import ThemeProvider from './components/ThemeProvider.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <Provider store={store}>
    <ThemeProvider>
      <App/>
    </ThemeProvider>
   </Provider>
  </React.StrictMode>,
)
