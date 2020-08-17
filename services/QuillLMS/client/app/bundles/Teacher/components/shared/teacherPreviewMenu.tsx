import * as React from "react";
import * as Redux from "redux";
import {connect} from "react-redux";
import stripHtml from "string-strip-html";
import { getActivity } from "../../../Grammar/actions/grammarActivities";
import getParameterByName from "../../../Grammar/helpers/getParameterByName";
import { Question } from '../../../Grammar/interfaces/questions';

export interface TeacherPreviewMenuProps {
  activity: { 
    title: string,
    questions: {
      key: string;
    }[]; 
  };
  dispatch: Function;
  onTogglePreview: () => void;
  onToggleQuestion: (question: Question) => void;
  questions: Question[];
  questionToPreview: { key: string };
  showPreview: boolean;
}
 
const TeacherPreviewMenu = ({ 
  activity, 
  dispatch, 
  onTogglePreview, 
  onToggleQuestion, 
  questions, 
  questionToPreview,
  showPreview 
}: TeacherPreviewMenuProps) => {

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
    onToggleQuestion(question);
  }

  const renderQuestions = () => {
    if(activity && questions) {
      return activity.questions.map((question: any, i) => {
        const { key } = question;
        const highlightedStyle = questionToPreview && questionToPreview.key === key ? 'highlighted' : '';
        return(
          <button className={`question-container ${highlightedStyle} focus-on-light`} id={key} key={key} onClick={handleQuestionUpdate} type="button">
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
        <div/>
        <h1>Menu</h1>
        <img onClick={handleToggleMenu} src={`${process.env.CDN_URL}/images/shared/close_x.svg`} />
      </div>
      <section className="preview-section">
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
