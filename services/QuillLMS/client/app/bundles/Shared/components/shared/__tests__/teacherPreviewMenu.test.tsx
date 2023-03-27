import { mount } from 'enzyme';
import * as React from 'react';
import { Provider } from "react-redux";

import createStore from '../../../../Connect/utils/configureStore';
import { TeacherPreviewMenu } from '../../../../Shared/index';
const store = createStore();

describe('TeacherPreviewMenu component', () => {
  const mockProps = {
    activity: {
      questions: [
        { key: 'abc' },
        { key: 'def' },
        { key: 'ghi' }
      ]
    },
    onHandleSkipToQuestionFromIntro: () => jest.fn(),
    questions: {
      'abc': {
        prompt: '123',
        title: 'abc'
      },
      'def': {
        prompt: '456',
        title: 'def'
      },
      'ghi': {
        prompt: '789',
        title: 'ghi'
      },
    },
    showPreview: true,
    isOnMobile: false
  }
  const component = mount(
    <Provider store={store}>
      <TeacherPreviewMenu {...mockProps} />
    </Provider>
  );
  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
