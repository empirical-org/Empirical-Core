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
    description?: string;
  };
  dispatch: Function;
  onTogglePreview: () => void;
  onToggleQuestion: (question: Question) => void;
  questions: Question[];
  questionToPreview: { 
    key?: string, 
    uid?: string 
  };
  session: any;
  showPreview: boolean;
}
 
const TeacherPreviewMenu = ({ 
  activity, 
  dispatch, 
  onTogglePreview, 
  onToggleQuestion, 
  questions, 
  questionToPreview,
  session,
  showPreview 
}: TeacherPreviewMenuProps) => {

  const [randomizedQuestions, setRandomizedQuestions] = React.useState<Question[]>();

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
    let question: Question;
    if(randomizedQuestions) {
      question = randomizedQuestions.filter(question => question.uid === questionUID)[0];
    } else {
      question = questions[questionUID]
    }
    onToggleQuestion(question);
  }

  const renderQuestions = () => {
    if(activity && activity.questions && questions) {
      return activity.questions.map((question: any, i) => {
        const { key } = question;
        const style = getStyling(key);
        return(
          <button className={`question-container ${style} focus-on-light`} id={key} key={key} onClick={handleQuestionUpdate} type="button">
            <p className="question-number">{`${i + 1}.  `}</p>
            <p className="question-text">{stripHtml(questions[key].prompt)}</p>
          </button>
        );
      })
    } else if(!randomizedQuestions && session.currentQuestion && session.unansweredQuestions) {
      const activityQuestions = [session.currentQuestion, ...session.unansweredQuestions];
      setRandomizedQuestions(activityQuestions);
      onToggleQuestion(session.currentQuestion);
    } else if(randomizedQuestions) {
      return randomizedQuestions.map((question: any, i) => {
        const { uid } = question;
        const style = getStyling(uid);
        return(
          <button className={`question-container ${style} focus-on-light`} id={uid} key={uid} onClick={handleQuestionUpdate} type="button">
            <p className="question-number">{`${i + 1}.  `}</p>
            <p className="question-text">{stripHtml(question.prompt)}</p>
          </button>
        );
      })
    } else {
      return null;
    }
  }

  const getStyling = (uidOrKey: string) => {
    let style;
    if(questionToPreview && questionToPreview.key) {
      style = questionToPreview.key === uidOrKey ? 'highlighted' : '';
    } else if(questionToPreview && questionToPreview.uid) {
      style = questionToPreview.uid === uidOrKey ? 'highlighted' : '';
    }
    return style;
  }

  const renderTitleSection = () => {
    if(activity) {
      return(
        <section>
          <h2>Activity</h2>
          <p>{activity.title}</p>
        </section>
      );
    }
  }

  const hiddenStyle = !showPreview ? 'hidden' : '';

  return (
    <div className={`teacher-preview-menu-container ${hiddenStyle}`}>
      <div className="header-container">
        <div />
        <h1>Menu</h1>
        <button className="close-preview-button focus-on-light" onClick={handleToggleMenu} type="button">
          <img alt="close-preview-button" src={`${process.env.CDN_URL}/images/icons/close.svg`} />
        </button>
      </div>
      <section className="preview-section">
        <h2>Preview Mode</h2>
        <p>This menu only displays for teachers previewing an activity. Students will not be able to skip questions.</p>
      </section>
      {renderTitleSection()}
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
    questions: state.questions.data,
    session: state.session
  };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch<any>) => {
  return {
      dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeacherPreviewMenu);
