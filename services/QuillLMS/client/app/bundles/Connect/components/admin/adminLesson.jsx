import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

import AdminLessonSidebar from './adminLessonSidebar.jsx'

import Question from '../questions/question';
import TitleCardForm from '../titleCards/titleCardForm.tsx';
import ShowTitleCard from '../titleCards/showTitleCard.tsx';
import FillInBlankQuestion from '../fillInBlank/fillInBlankQuestion.jsx';
import SentenceFragment from '../sentenceFragments/sentenceFragment.jsx';


const AdminLesson = () => {
  return (
    <div style={{display: 'flex', width: '100%'}}>
      <Switch>
        <Route component={AdminLessonSidebar} path='/admin/lesson-view/:lessonID/questions/:questionID' />
        <Route component={AdminLessonSidebar} path='/admin/lesson-view/:lessonID/sentence-fragments/:questionID' />
        <Route component={AdminLessonSidebar} path='/admin/lesson-view/:lessonID/fill-in-the-blanks/:questionID' />
        <Route component={AdminLessonSidebar} path='/admin/lesson-view/:lessonID/title-cards/:titleCardID' />
      </Switch>
      <Switch>
        <Route component={Question} path='/admin/lesson-view/:lessonID/questions/:questionID' />
        <Route component={TitleCardForm} path='/admin/lesson-view/:lessonID/title-cards/:titleCardID/edit' />
        <Route component={ShowTitleCard} path='/admin/lesson-view/:lessonID/title-cards/:titleCardID' />
        <Route component={FillInBlankQuestion} path='/admin/lesson-view/:lessonID/fill-in-the-blanks/:questionID' />
        <Route component={SentenceFragment} path='/admin/lesson-view/:lessonID/sentence-fragments/:questionID' />
      </Switch>
    </div>
  )
}

export default withRouter(AdminLesson);
