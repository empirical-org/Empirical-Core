import * as React from 'react';
import CurrentSlide from './currentSlide';
import NextSlideButton from './nextSlideButton';
import { Lesson, Edition } from './dataContainer';
import {ClassroomLessonSession} from '../interfaces';

interface MainContentContainerProps extends React.Props<any> {
  params: any
  lesson: Lesson
  edition: Edition
  session: ClassroomLessonSession
}

const MainContentContainer = (props:MainContentContainerProps) =>
  (<div className="main-content">
    <div className="main-content-wrapper">
      <CurrentSlide params={props.params} session={props.session} edition={props.edition} lesson={props.lesson}/>
      <div className="next-slide-button-container">
        <NextSlideButton params={props.params} session={props.session} edition={props.edition} lesson={props.lesson}/>
      </div>
    </div>
  </div>);

export default MainContentContainer;
