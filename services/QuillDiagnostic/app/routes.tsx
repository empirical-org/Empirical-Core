import * as React from "react";
import { RouteConfig } from "react-router-config";
import Admin from "./components/admin/admin"
// import CloneConnectQuestions from './components/cloneConnect/cloneConnectQuestions.tsx';
// import ConceptsFeedback from 'components/feedback/concepts-feedback.jsx';
// import ConceptFeedback from 'components/feedback/concept-feedback.jsx';
// import Concepts from 'components/concepts/concepts.jsx';
// import Concept from 'components/concepts/concept.jsx';

export const routes: RouteConfig[] = [
  {
    path: "/admin",
    component: () => (<Admin />)
  }
];