import React from "react";
import { render } from 'react-dom'
import Root from "./components/root";
import createStore from './utils/configureStore';
import { Provider } from 'react-redux';
import findAndFix from './reducers/combined';

let store = createStore();

const root = document.getElementById('root')

render((
  <Provider store={store}>
    <Root />
  </Provider>),
  root
);
