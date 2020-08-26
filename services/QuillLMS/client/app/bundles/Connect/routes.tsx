import * as React from "react";
import { RouteConfig } from "react-router-config";
import Admin from "./components/admin/admin"
import Lesson from "./components/studentLessons/lesson"
import Turk from './components/turk/turkActivity.jsx';

export const routes: RouteConfig[] = [
  {
    path: "/admin",
    component: () => (<Admin />)
  },
  {
    path: "/play/lesson/:lessonID",
    component: (props: any) => {
      const { handleToggleQuestion, previewMode,  questionToPreview, switchedBackToPreview } = props;
      return(
        <Lesson 
          onHandleToggleQuestion={handleToggleQuestion} 
          previewMode={previewMode} 
          questionToPreview={questionToPreview} 
          switchedBackToPreview={switchedBackToPreview}
        />
      );
    }
  },
  {
    path: "/play/turk/:lessonID",
    component: () => (<Turk />)
  }
];
