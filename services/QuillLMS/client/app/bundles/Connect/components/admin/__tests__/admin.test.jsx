import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import 'whatwg-fetch';
import createStore from '../../../utils/configureStore';
import Question from '../../questions/question';
import Admin from "../admin";
import AdminLessonSidebar from '../adminLessonSidebar';
import AdminMainSidebar from '../adminMainSidebar.jsx';

describe('adminContainer component', () => {

  const store = createStore();

  it('should render with lessons sidebar when url contains lesson-view', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/admin/lesson-view/lessonID/questions/questionID' ]} keyLength={0}>
          <Admin />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(AdminLessonSidebar)).toHaveLength(1);
    expect(wrapper.find(Question)).toHaveLength(1);
  });

  it('should render with main sidebar when url does not contain lesson-view', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[ '/admin/lessons' ]} keyLength={0}>
          <Admin />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(AdminMainSidebar)).toHaveLength(1);
  });
});
