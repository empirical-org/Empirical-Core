import * as React from "react";
import * as Redux from "redux";
import { connect } from "react-redux";
import stripHtml from "string-strip-html";
import { getActivity } from "../../../Grammar/actions/grammarActivities";
import getParameterByName from "../../../Grammar/helpers/getParameterByName";
import { Question } from '../../../Grammar/interfaces/questions';

interface Activity {
  title?: string,
  name?: string,
  questions: {
    key: string;
  }[]; 
  description?: string;
}

const returnActivity = (state: any) => {
  const { grammarActivities, lessons } = state;
  if(grammarActivities) {
    return grammarActivities.currentActivity;
  } else if(lessons && lessons.data) {
    const uid = Object.keys(lessons.data)[0];
    return lessons.data[uid]
  }
  return null;
}

const returnQuestions = (questions: any) => {
  const { data } = questions;
  if(data && Object.keys(data).length === 0) {
    return null;
  }
  return data;
}

const returnTitleCards = (titleCards: any) => {
  const { data } = titleCards;
  if(data && Object.keys(data).length === 0) {
    return null;
  }
  return data;
}

const renderTitleSection = (activity: Activity) => {
  if (!activity) { return }
  return(
    <section>
      <h2>Activity</h2>
      <p>{activity.title || activity.name}</p>
    </section>
  );
}

const getStyling = (questionToPreview, uidOrKey: string, i: number) => {
  let key: string;
  if(questionToPreview) {
    key = questionToPreview.key ? questionToPreview.key : questionToPreview.uid;
  }
  // if first question has no key from initial render, apply highlight
  return key === uidOrKey || (i === 0 && !key) ? 'highlighted' : '';
}

const getIndentation = (i: number) => {
  return i < 9 ? 'indented' : '';
}

const getQuestionObject = ({questions, titleCards, key}) => {
  let questionObject;
  if(questions[key]) {
    questionObject = questions[key]
  } else if(titleCards && titleCards[key]) {
    questionObject = titleCards[key]
  } else {
    return {
      prompt: '',
      title: ''
    }
  }
  return questionObject;
}

const renderQuestions = ({ 
  activity, 
  handleQuestionUpdate, 
  questions, 
  questionToPreview,
  randomizedQuestions, 
  session,
  titleCards
}) => {
  if(!activity && !randomizedQuestions && !session) {
    return null;
  } else if(activity && activity.questions && questions) {
    return activity.questions.map((question: any, i: number) => {
      const { key } = question;
      const questionObject = getQuestionObject({ questions, titleCards, key });
      const questionText = questionObject.prompt || questionObject.title
      const style = getStyling(questionToPreview, key, i);
      const indentation = getIndentation(i);
      if(!questionObject) {
        return null;
      }
      return(
        <button className={`question-container ${style} focus-on-light`} id={key} key={key} onClick={handleQuestionUpdate} type="button">
          <p className={`question-number ${indentation}`}>{`${i + 1}.  `}</p>
          <p className="question-text">{stripHtml(questionText)}</p>
        </button>
      );
    })
  } else if(randomizedQuestions) {
    return randomizedQuestions.map((question: any, i: number) => {
      const { uid } = question;
      const style = getStyling(questionToPreview, uid, i);
      const indentation = getIndentation(i);
      return(
        <button className={`question-container ${style} focus-on-light`} id={uid} key={uid} onClick={handleQuestionUpdate} type="button">
          <p className={`question-number ${indentation}`}>{`${i + 1}.  `}</p>
          <p className="question-text">{stripHtml(question.prompt)}</p>
        </button>
      );
    });
  }
}

export interface TeacherPreviewMenuProps {
  activity: Activity;
  dispatch: Function;
  onTogglePreview?: () => void;
  onToggleQuestion?: (question: Question) => void;
  onUpdateRandomizedQuestions?: (questions: any[]) => void
  questions: Question[];
  questionToPreview?: { 
    key?: string, 
    uid?: string 
  };
  session: any;
  showPreview: boolean;
  titleCards: any;
}
 
const TeacherPreviewMenu = ({ 
  activity,
  dispatch, 
  onTogglePreview, 
  onToggleQuestion, 
  onUpdateRandomizedQuestions,
  questions, 
  questionToPreview,
  session,
  showPreview,
  titleCards
}: TeacherPreviewMenuProps) => {

  const [randomizedQuestions, setRandomizedQuestions] = React.useState<Question[]>();

  React.useEffect(() => {  
    const activityUID = getParameterByName('uid', window.location.href);
    if (activityUID) {
      dispatch(getActivity(activityUID))
    }
    if(!randomizedQuestions && session && session.hasreceiveddata && session.currentQuestion) {
      const activityQuestions = [session.currentQuestion, ...session.unansweredQuestions];
      setRandomizedQuestions(activityQuestions);
      onUpdateRandomizedQuestions(activityQuestions);
      onToggleQuestion(session.currentQuestion);
    }
  }, [session]);

  const handleToggleMenu = () => {
    onTogglePreview();
  }

  const handleQuestionUpdate = (e: React.SyntheticEvent) => {
    const questionUID = e.currentTarget.id;
    let question: Question;
    if(randomizedQuestions) {
      question = randomizedQuestions.filter(question => question.uid === questionUID)[0];
    } else {
      question = questions[questionUID] || titleCards[questionUID];
      question.key = questionUID;
    }
    onToggleQuestion(question);
  }

  const hiddenStyle = !showPreview ? 'hidden' : '';

  return (
    <aside className={`teacher-preview-menu-container ${hiddenStyle}`}>
      <section className="header-container">
        <h1>Menu</h1>
        <button className="close-preview-button focus-on-light" onClick={handleToggleMenu} type="button">
          <img alt="close-preview-button" src={`${process.env.CDN_URL}/images/icons/close.svg`} />
        </button>
      </section>
      <section className="preview-section">
        <h2>Preview Mode</h2>
        <p>This menu only displays for teachers previewing an activity. Students will not be able to skip questions.</p>
      </section>
      {renderTitleSection(activity)}
      <section>
        <h2>Questions</h2>
        <ul>
          {renderQuestions({  
            activity, 
            handleQuestionUpdate,
            questions, 
            questionToPreview,
            randomizedQuestions, 
            session,
            titleCards
          })}
        </ul>
      </section>
    </aside>
  );
}

const mapStateToProps = (state: any) => {
  const { questions, session, titleCards } = state;
  return {
    activity: returnActivity(state),
    questions: questions ? returnQuestions(questions) : null,
    session: session,
    titleCards: titleCards ? returnTitleCards(titleCards) : null
  };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch<any>) => {
  return {
    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeacherPreviewMenu);
