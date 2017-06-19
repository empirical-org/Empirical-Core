import React from 'react';
import { connect } from 'react-redux';
import AnswerForm from '../../renderForQuestions/renderFormForAnswer.jsx';
const Markdown = require('react-remarkable');

const playLessonClassroomQuestion = React.createClass({
  render() {
    // const component = (
    //   <AnswerForm
    //     handleChange={() => {}}
    //     nextQuestionButton={() => {}}
    //     multipleChoiceCorrect={() => {}}
    //     disabled
    //     finished
    //   />
    // );
    return (
      <div>
        <p>Here is the classroom lesson question.</p>
      </div>
    );
  },

});

function select(state) {
  return {
  };
}

export default connect(select)(playLessonClassroomQuestion);
