import 'whatwg-fetch'
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Provider } from 'react-redux'

import createStore from '../../../utils/configureStore';
import ExpandLessonQuestions from '../lessons'

describe('ExpandLessonQuestions component', () => {

  const store = createStore();
  const props = {
    text: 'test',
    basePath: 'path',
    itemKey: 'key',
    listElements: ['one','two'],
    goToButtonText: 'go to',
    showHideButtonText: 'show hide'
  }

  const wrapper = shallow(<Provider store={store}><ExpandLessonQuestions props={props} /></Provider>)
  it('matches the snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
