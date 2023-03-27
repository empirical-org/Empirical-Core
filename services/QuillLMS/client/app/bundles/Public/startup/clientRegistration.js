import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import ReactOnRails from 'react-on-rails';

import ApApp from './apApp';
import DemoAccountBanner from './demoAccountBannerApp';
import PreApApp from './preApApp';
import PremiumPricingGuideApp from './premiumPricingGuideApp';
import QuestionsAndAnswersApp from './questionsAndAnswersApp';
import SpringBoardApp from './springBoardApp';

require('../../../assets/styles/home.scss');
require('../../Home/bootstrap_carousel.js');

ReactOnRails.register({ PremiumPricingGuideApp, QuestionsAndAnswersApp, ApApp, PreApApp, SpringBoardApp, DemoAccountBanner });
