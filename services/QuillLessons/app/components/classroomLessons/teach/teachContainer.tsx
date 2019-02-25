import React from 'react';
import Sidebar from './sidebar';
import MainContentContainer from './mainContentContainer';

class TeachContainer extends React.Component {
  
  render(){
    const {params, session, lesson, edition} = this.props;
    const teachLessonContainerStyle = session.preview
    ? {'height': 'calc(100vh - 113px)'}
    : {'height': 'calc(100vh - 60px)'}
    return (
      <div className="teach-lesson-container" style={teachLessonContainerStyle}>
        {/* <p>Current Slide {session.current_slide}</p>
        <p>Edition Name: {edition.name}</p>
        <p>Lesson Title: {lesson.title}</p> */}
        <Sidebar params={params} session={session} edition={edition} lesson={lesson}></Sidebar>
        <MainContentContainer params={params} session={session} edition={edition} lesson={lesson}/>
      </div>
    )
  }
}

export default TeachContainer;