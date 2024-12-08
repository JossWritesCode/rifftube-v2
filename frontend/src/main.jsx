import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './SCSS/main.scss'
import App from './App.jsx'

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import defaultReducer from './reducers';
import {thunk} from 'redux-thunk';

//import "./SCSS/main.scss";

const store = createStore(defaultReducer, applyMiddleware(thunk));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
