import * as React from "react";
import * as Redux from "redux";
import {connect} from "react-redux";
import stripHtml from "string-strip-html";
import { getActivity } from "../../../Grammar/actions/grammarActivities";
import getParameterByName from "../../../Grammar/helpers/getParameterByName";

export interface TeacherPreviewMenuProps {
  activity: { 
    title: string,
    questions: {
      key: string;
    }[]; 
  };
  dispatch: Function;
  onTogglePreview: () => void;
  onToggleQuestion: (question: object) => void;
  questions: object;
  session: {
    unansweredQuestions: {
      prompt: string;
      uid: string;
    }[];
    currentQuestion: {
      prompt: string;
      uid: string
    }
  };
  showPreview: boolean;
}
 
const TeacherPreviewMenu = ({ activity, dispatch, onTogglePreview, onToggleQuestion, questions, showPreview }: TeacherPreviewMenuProps) => {

  React.useEffect(() => {  
    const activityUID = getParameterByName('uid', window.location.href);
    if (activityUID) {
      dispatch(getActivity(activityUID))
    }
  }, []);

  const handleToggleMenu = () => {
    onTogglePreview();
  }

  const handleQuestionUpdate = (e: React.SyntheticEvent) => {
    const questionUID = e.currentTarget.id;
    const question = questions[questionUID]
    console.log('question', question);
    onToggleQuestion(question);
  }

  const renderQuestions = () => {
    if(activity && questions) {
      return activity.questions.map((question, i) => {
        // const highlightedStyle = currentQuestion.uid === question.uid ? 'highlighted' : '';
        const { key } = question;
        const highlightedStyle = '';
        return(
          <button className={`question-container ${highlightedStyle}`} onClick={handleQuestionUpdate} id={key}>
            <p className="question-number">{`${i + 1}.  `}</p>
            <p className="question-text">{stripHtml(questions[key].prompt)}</p>
          </button>
        );
      })
    } else {
      return null;
    }
  }

  const hiddenStyle = !showPreview ? 'hidden' : '';

  return (
    <div className={`teacher-preview-menu-container ${hiddenStyle}`}>
      <div className="header-container">
        <h1>Menu</h1>
        <button onClick={handleToggleMenu} type="button">x</button>
      </div>
      <section>
        <h2>Preview Mode</h2>
        <p>This menu only displays for teachers previewing an activity. Students will not be able to skip questions.</p>
      </section>
      <section>
        <h2>Activity</h2>
        <p>{activity && activity.title}</p>
      </section>
      <section>
        <h2>Introduction</h2>
        <p>joing words</p>
      </section>
      <section>
        <h2>Questions</h2>
        <ul>
          {renderQuestions()}
        </ul>
      </section>
    </div>
  );
}

const mapStateToProps = (state: any) => {
  return {
    activity: state.grammarActivities ? state.grammarActivities.currentActivity : null,
    questions: state.questions.data
  };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch<any>) => {
  return {
      dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeacherPreviewMenu);
