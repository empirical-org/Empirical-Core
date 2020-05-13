import React from 'react';
import Lesson from '../lessons/lesson.jsx';
import Questions from '../questions/questions.jsx';
import Question from '../questions/question';

class AdminLessonSidebar extends React.Component {
  render() {
    const { match } = this.props
    return (
      <section className="section is-fullheight" style={{ display: 'flex', flexDirection: 'row', paddingTop: 0, paddingBottom: 0}}>
        <aside className="menu" style={{ width: 300, borderRight: '1px solid #e3e3e3', padding: 15, paddingLeft: 0, overflowY: 'scroll', height: '100vh',}}>
          <Lesson isSidebar={true} location={location} match={match} />
        </aside>
      </section>
    );
  }
}

export default AdminLessonSidebar;