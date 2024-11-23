import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import App from './App.jsx'
import './index.css'


import App from './App';
//import * as serviceWorker from './serviceWorker';

import defaultReducer from './reducers';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import { thunk } from 'redux-thunk';

import { GoogleOAuthProvider } from '@react-oauth/google';

import './fonts/Limelight-Regular.ttf';
//import './SCSS/main.scss';


const store = createStore(defaultReducer, applyMiddleware(thunk));

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="941154439836-s6iglcrdckcj6od74kssqsom58j96hd8.apps.googleusercontent.com">
    <Provider store={store}>
      <StrictMode>
        <App />
      </StrictMode>
    </Provider>
  </GoogleOAuthProvider>
);