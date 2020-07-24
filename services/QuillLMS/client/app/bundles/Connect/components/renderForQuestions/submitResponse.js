// import {submitResponseAnon, submitResponse} from '../../actions.js'
import rootRef from '../../libs/firebase';
const sessionsRef = rootRef.child('sessions');

export default function submitQuestionResponse(response, props, sessionKey, submitFunction) {
  const action = submitFunction(response);
  props.dispatch(action);
  // var sessionRef = sessionsRef.child(sessionKey + '/attempts').set(props.question.attempts, (error) => {
  //   return
  // })
}
