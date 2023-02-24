import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import ReactOnRails from 'react-on-rails';

import PremiumPricingGuideApp from './premiumPricingGuideApp';
import QuestionsAndAnswersApp from './questionsAndAnswersApp'
import ApApp from './apApp'
import PreApApp from './preApApp'
import SpringBoardApp from './springBoardApp'

require('../../../assets/styles/home.scss');
require('../../Home/bootstrap_carousel.js');

ReactOnRails.register({ PremiumPricingGuideApp, QuestionsAndAnswersApp, ApApp, PreApApp, SpringBoardApp });
