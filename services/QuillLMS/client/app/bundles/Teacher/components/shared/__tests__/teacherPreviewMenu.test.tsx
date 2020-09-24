import * as React from 'react';
import { mount } from 'enzyme';
import { Provider } from "react-redux";
import { TeacherPreviewMenu } from '../../../../Shared/index';
import createStore from '../../../../Connect/utils/configureStore';
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
    showPreview: true
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
