import React from 'react';
import 'whatwg-fetch'
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router';
import Admin from "../admin"
import { Provider } from 'react-redux'
import createStore from '../../../utils/configureStore';
import AdminMainSidebar from '../adminMainSidebar.jsx'
import AdminLessonSidebar from '../adminLessonSidebar';
import Question from '../../questions/question'

describe('adminContainer component', () => {

  const store = createStore();

  it('should render with lessons sidebar when url contains lesson-view', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[ '/admin/lesson-view/lessonID/questions/questionID' ]}>
          <Admin />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(AdminLessonSidebar)).toHaveLength(1);
    expect(wrapper.find(Question)).toHaveLength(1);
  });

  it('should render with main sidebar when url doesn not contain lesson-view', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[ '/admin/lessons' ]}>
          <Admin />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(AdminMainSidebar)).toHaveLength(1);
  });
})
