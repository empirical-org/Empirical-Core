import * as React from 'react';
import { connect } from 'react-redux';
import StudentDiagnostic from '../diagnostics/studentDiagnostic';
import ELLStudentDiagnostic from '../eslDiagnostic/studentDiagnostic';
import { SmartSpinner } from 'quill-component-library/dist/componentLibrary';
import { Diagnostic } from '../../interfaces/diagnostic';
import { Location } from '../../interfaces/location';
import { Route } from '../../interfaces/route';
import { Router } from '../../interfaces/router';
import { FillInBlankReducerState } from '../../reducers/fillInBlank';
import { QuestionsReducerState } from '../../reducers/questions';
import { SentenceFragmentsReducerState } from '../../reducers/sentenceFragments';
import { TitleCardsReducerState } from '../../reducers/titleCards';

// interface DiagnosticRouterProps {
//     children: any,
//     dispatch(action: any): any,
//     fillInBlank: FillInBlankReducerState,
//     lessons: {},
//     location: Location,
//     params: {
//         diagnosticID: string
//     },
//     questions: QuestionsReducerState,
//     route: Route,
//     routeParams: {
//         diagnosticID: string
//     },
//     router: Router,
//     routes: Route[],
//     sessions: {
//         data: any
//     },
//     sentenceFragments: SentenceFragmentsReducerState,
//     titleCards: TitleCardsReducerState,
// }

// const DiagnosticRouter: React.SFC<DiagnosticRouterProps> = (props) => {
//     console.log('props', this.props);
//     const { diagnosticID } = props.params;
//     const { data, hasreceiveddata } = props.lessons;
//     if(hasreceiveddata) {
//         if(data[diagnosticID].isELL) {
//             return <ELLStudentDiagnostic params={props.params}/>;
//         } else {
//             return <StudentDiagnostic params={props.params}/>;
//         }
//     } else {
//         return <SmartSpinner key="loading-diagnostic"/>
//     }
// };
const DiagnosticRouter = (props) => {
    console.log('props', props);
    const { diagnosticID } = props.params;
    const { data, hasreceiveddata } = props.lessons;
    if(hasreceiveddata) {
        if(data[diagnosticID].isELL) {
            return <ELLStudentDiagnostic params={props.params}/>;
        } else {
            return <StudentDiagnostic params={props.params}/>;
        }
    } else {
        return <SmartSpinner key="loading-diagnostic"/>
    }
};
const select = (state) => {
    return {
        routing: state.routing,
        questions: state.questions,
        playDiagnostic: state.playDiagnostic,
        sentenceFragments: state.sentenceFragments,
        fillInBlank: state.fillInBlank,
        sessions: state.sessions,
        lessons: state.lessons,
        titleCards: state.titleCards
    };
}
export default connect(select)(DiagnosticRouter);