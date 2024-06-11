import { PRODUCTION } from "../../../constants/flagOptions";
import { startListeningToQuestions as grammarListenToQuestions } from "../../Grammar/actions/questions";
import connect from "../../Connect/actions/questions";
import diagnostic from "../../Diagnostic/actions/questions";
import { CONNECT, DIAGNOSTIC, GRAMMAR } from "../utils/constants";

export const reloadQuestionsIfNecessary = (flag: String, activityType: String) => {
  if (flag !== PRODUCTION) { return null; }
  return (dispatch: Function) => {
    switch (activityType) {
      case GRAMMAR:
        dispatch(grammarListenToQuestions());
        break;
      case CONNECT:
        dispatch(connect.loadQuestions());
        break;
      case DIAGNOSTIC:
        dispatch(diagnostic.loadQuestions());
        break;
    }
  }
}
