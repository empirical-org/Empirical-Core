import * as React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, withRouter } from 'react-router-dom';

import { SmartSpinner } from '../../../Shared/index';
import { Location } from '../../interfaces/location';
import { PlayDiagnostic } from '../../interfaces/playDiagnostic';
import { RouteInterface } from '../../interfaces/routeInterface';
import { Router } from '../../interfaces/router';
import { FillInBlankReducerState } from '../../reducers/fillInBlank';
import { LessonsReducerState } from '../../reducers/lessons';
import { QuestionsReducerState } from '../../reducers/questions';
import { SentenceFragmentsReducerState } from '../../reducers/sentenceFragments';
import { TitleCardsReducerState } from '../../reducers/titleCards';
import StudentDiagnostic from '../diagnostics/studentDiagnostic';
import ELLStudentDiagnostic from '../eslDiagnostic/studentDiagnostic';

// TODO: The StudentDiagnostic and ELLDiagnostic have the same state shape and share most of the same functions. Since they are receiving props from
// here as well, we should extract those functions into this DiagnosticRouter component, pass them as props and convert them into functional components.

interface DiagnosticRouterProps {
  children: any,
  dispatch(action: any): any,
  fillInBlank: FillInBlankReducerState,
  lessons: LessonsReducerState,
  location: Location,
  match: {
    params: {
      diagnosticID: string
    }
  },
  onHandleToggleQuestion: (question: object) => void,
  playDiagnostic: PlayDiagnostic,
  previewMode: boolean,
  questions: QuestionsReducerState,
  questionToPreview: object,
  route: RouteInterface,
  routeParams: {
    diagnosticID: string
  },
  router: Router,
  routes: Route[],
  sessions: {
    data: any
  },
  sentenceFragments: SentenceFragmentsReducerState,
  skippedToQuestionFromIntro: boolean,
  switchedBackToPreview: boolean,
  titleCards: TitleCardsReducerState,
}

export const DiagnosticRouter: React.SFC<DiagnosticRouterProps> = (props: DiagnosticRouterProps) => {
  const { fillInBlank, lessons, match, questions, sentenceFragments } = props;
  const { params } = match;
  const { diagnosticID } = params;
  const { data } = lessons;
  if(fillInBlank.hasreceiveddata && lessons.hasreceiveddata && questions.hasreceiveddata && sentenceFragments.hasreceiveddata) {
    if(data[diagnosticID] && data[diagnosticID].isELL) {
      return(
        <div>
          <ELLStudentDiagnostic {...props} />
          <BrowserRouter>
            <Route component={ELLStudentDiagnostic} path='/play/diagnostic/:diagnosticID' />
          </BrowserRouter>
        </div>
      )
    } else if(data[diagnosticID] && !data[diagnosticID].isELL) {
      return(
        <div>
          <StudentDiagnostic {...props} />
          <BrowserRouter>
            <Route component={StudentDiagnostic} path='/play/diagnostic/:diagnosticID' />
          </BrowserRouter>
        </div>
      )
    }
  } else {
    return(
      <section className="section is-fullheight minus-nav student">
        <div className="student-container student-container-diagnostic">
          <SmartSpinner key="loading-diagnostic" message='Loading Your Lesson 25%' />
        </div>
      </section>
    );
  }
};

const select = (state: any, props: any) => {
  return {
    routing: state.routing,
    match: props.match,
    questions: state.questions,
    playDiagnostic: state.playDiagnostic,
    sentenceFragments: state.sentenceFragments,
    fillInBlank: state.fillInBlank,
    sessions: state.sessions,
    lessons: state.lessons,
    titleCards: state.titleCards
  };
}

export default withRouter(connect(select)(DiagnosticRouter));
