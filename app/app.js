import React from "react";
import { render } from 'react-dom'
import Root from "./components/root";
import createStore from './utils/configureStore';
import { Provider } from 'react-redux';
import findAndFix from './reducers/combined';
import RedBox from 'redbox-react';

let store = createStore();

const root = document.getElementById('root')

try {
  render((
    <Provider store={store}>
      <Root />
    </Provider>),
    root
  );
} catch (e) {
  render(<RedBox error={e} />, root)
}
