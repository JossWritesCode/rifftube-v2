import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
//import * as serviceWorker from './serviceWorker';


import './fonts/Limelight-Regular.ttf';
import './SCSS/main.scss';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import defaultReducer from './reducers';
import {thunk} from 'redux-thunk';

const store = createStore(defaultReducer, applyMiddleware(thunk));

const container = document.getElementById('root');
const root = createRoot(container);

root.render( 
  <Provider store={store}>
    <App />
  </Provider> );

//serviceWorker.unregister();
