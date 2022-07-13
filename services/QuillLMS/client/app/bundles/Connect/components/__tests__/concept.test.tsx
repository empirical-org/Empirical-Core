import * as React from 'react';
import { mount } from 'enzyme';
import { Provider } from "react-redux";

import Concept from '../concepts/concept';
import createStore from '../../utils/configureStore';

const store = createStore();
const mockProps = {
  concepts: {
    hasreceiveddata: false,
    data: []
  },
  match: {
    params: {
      conceptID: 'abc-123'
    }
  },
  questions: {
    hasreceiveddata: false,
    data: []
  },
  fillInBlank: {
    hasreceiveddata: false,
    data: []
  }
}

describe('Concept component', () => {

  it('should render Concept', () => {
    const component = mount(
      <Provider store={store}>
        <Concept {...mockProps} />
      </Provider>
    );
    expect(component).toMatchSnapshot();
  });
});

