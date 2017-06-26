import FillInBlankQuestions from 'components/fillInBlank/fillInBlankQuestions.jsx';

export default {
  path: 'fill-in-the-blanks',
  indexRoute: {
    component: FillInBlankQuestions,
  },
  getChildRoutes: (partialNextState, cb) => {
    Promise.all([
      System.import(/* webpackChunkName: "new-fill-in-the-blank" */ './newFillInTheBlank.js'),
      System.import(/* webpackChunkName: "fill-in-the-blanks" */'./fillInTheBlank.js')
    ])
    .then(modules => cb(null, modules.map(module => module.default)))
    .catch(err => console.error('Dynamic page loading failed', err));
  },

};
