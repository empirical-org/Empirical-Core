import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import ReactOnRails from 'react-on-rails';

import PremiumPricingGuideApp from './premiumPricingGuideApp';
import QuestionsAndAnswersApp from './questionsAndAnswersApp'
import ApApp from './apApp'
import PreApApp from './preApApp'
import SpringBoardApp from './springBoardApp'
import BlogPostsApp from './blogPostsApp'

require('../../../assets/styles/home.scss');
require('../../Home/bootstrap_carousel.js');
// import '../../Teacher/styles/styles.scss'

ReactOnRails.register({ PremiumPricingGuideApp, QuestionsAndAnswersApp, ApApp, PreApApp, SpringBoardApp, BlogPostsApp });
