import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import 'whatwg-fetch';
import createStore from '../../../utils/configureStore';
import FillInBlankQuestion from '../../fillInBlank/fillInBlankQuestion.jsx';
import Question from '../../questions/question';
import SentenceFragment from '../../sentenceFragments/sentenceFragment';
import ShowTitleCard from '../../titleCards/showTitleCard.tsx';
import AdminLesson from "../adminLesson";
import AdminLessonSidebar from '../adminLessonSidebar';


describe('adminLesson component', () => {

  const store = createStore();

  it('should render with lessons sidebar and question container', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[ '/admin/lesson-view/lessonID/questions/questionID' ]} keyLength={0}>
          <AdminLesson />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(AdminLessonSidebar)).toHaveLength(1);
    expect(wrapper.find(Question)).toHaveLength(1);
  });

  it('should render with lessons sidebar and sentence fragments container', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[ '/admin/lesson-view/lessonID/sentence-fragments/questionID' ]} keyLength={0}>
          <AdminLesson />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(AdminLessonSidebar)).toHaveLength(1);
    expect(wrapper.find(SentenceFragment)).toHaveLength(1);
  });

  it('should render with lessons sidebar and fill in blank container', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[ '/admin/lesson-view/lessonID/fill-in-the-blanks/questionID' ]} keyLength={0}>
          <AdminLesson />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(AdminLessonSidebar)).toHaveLength(1);
    expect(wrapper.find(FillInBlankQuestion)).toHaveLength(1);
  });

  it('should render with lessons sidebar and title card container', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[ '/admin/lesson-view/lessonID/title-cards/questionID' ]} keyLength={0}>
          <AdminLesson />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(AdminLessonSidebar)).toHaveLength(1);
    expect(wrapper.find(ShowTitleCard)).toHaveLength(1);
  });
})
