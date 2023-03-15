import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import ReactOnRails from 'react-on-rails';

import PremiumPricingGuideApp from './premiumPricingGuideApp';
import QuestionsAndAnswersApp from './questionsAndAnswersApp'
import ApApp from './apApp'
import PreApApp from './preApApp'
import SpringBoardApp from './springBoardApp'
import DemoAccountBanner from './demoAccountBannerApp'

require('../../../assets/styles/home.scss');
require('../../Home/bootstrap_carousel.js');

ReactOnRails.register({ PremiumPricingGuideApp, QuestionsAndAnswersApp, ApApp, PreApApp, SpringBoardApp, DemoAccountBanner });
