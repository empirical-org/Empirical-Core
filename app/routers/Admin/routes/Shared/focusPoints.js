import FocusPointsContainer from 'components/focusPoints/focusPointsContainer.jsx';
import EditFocusPointsContainer from 'components/focusPoints/editFocusPointsContainer.jsx';
import NewFocusPointsContainer from 'components/focusPoints/newFocusPointsContainer.jsx';

const newFocusPoint = {
  path: 'new',
  component: NewFocusPointsContainer,
};

const editFocusPoint = {
  path: ':focusPointID/edit',
  component: EditFocusPointsContainer,
};

export default {
  path: 'focus-points',
  indexRoute: {
    component: FocusPointsContainer,
  },
  childRoutes: [
    newFocusPoint,
    editFocusPoint
  ],
};
