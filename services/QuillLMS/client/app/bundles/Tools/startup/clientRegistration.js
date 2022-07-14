import ReactOnRails from 'react-on-rails';
import QuestionsAndAnswersApp from './questionsAndAnswersAppClient.jsx'
import 'lazysizes';
// import a plugin
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

require('../../../assets/styles/home.scss');
require('../../Home/bootstrap_carousel.js');

ReactOnRails.register({ QuestionsAndAnswersApp });
