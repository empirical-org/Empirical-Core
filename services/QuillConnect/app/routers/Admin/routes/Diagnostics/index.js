import Diagnostics from 'components/diagnostics/diagnostics.jsx';
import NewDiagnostic from 'components/diagnostics/new.jsx';

const newDiagnosticRoute = {
  path: 'new',
  component: NewDiagnostic,
};

export default {
  path: 'diagnostics',
  indexRoute: {
    component: Diagnostics,
  },
  childRoutes: [
    newDiagnosticRoute
  ],
};