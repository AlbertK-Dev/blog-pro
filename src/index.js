import React from 'react';
import ReactDOM from 'react-dom/client';
import  store  from "./redux/setup/store";

import App from './App';
import { Provider } from 'react-redux';
import LangProvider from './provider/langProvider';
// import MuiThemeProvider from './theme';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <LangProvider>
        {/* <MuiThemeProvider> */}
      <App />
    {/* </MuiThemeProvider> */}
      </LangProvider>
  </React.StrictMode>
  </Provider>
 
);

