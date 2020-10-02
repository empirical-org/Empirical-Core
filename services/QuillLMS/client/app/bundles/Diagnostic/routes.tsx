import * as React from "react";
import { RouteConfig } from "react-router-config";
import Admin from "./components/admin/admin"
import DiagnosticRouter from "./components/shared/diagnosticRouter"
import Turk from './components/turk/turkDiagnostic.jsx';

export const routes: RouteConfig[] = [
  {
    path: "/admin",
    component: () => (<Admin />)
  },
  {
    path: "/play/diagnostic/:diagnosticID",
    component: (props: any) => {
      const { handleToggleQuestion, previewMode, questionToPreview, switchedBackToPreview, skippedToQuestionFromIntro } = props;
      return(
        <DiagnosticRouter
          onHandleToggleQuestion={handleToggleQuestion}
          previewMode={previewMode}
          questionToPreview={questionToPreview}
          skippedToQuestionFromIntro={skippedToQuestionFromIntro}
          switchedBackToPreview={switchedBackToPreview}
        />
      );
    }
  },
  {
    path: "/turk/:diagnosticID",
    component: () => (<Turk />)
  }
];
