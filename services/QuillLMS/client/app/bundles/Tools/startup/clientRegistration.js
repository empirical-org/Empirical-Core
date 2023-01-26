import ReactOnRails from 'react-on-rails';
import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

import QuestionsAndAnswersApp from './questionsAndAnswersAppClient.jsx'
import EvidenceToolApp from './evidenceToolAppClient'
import EvidenceHomeSectionApp from './evidenceHomeSectionAppClient'
import SubNavbarApp from './subNavbarAppClient'

require('../../../assets/styles/home.scss');
require('../../Home/bootstrap_carousel.js');

ReactOnRails.register({ QuestionsAndAnswersApp, EvidenceToolApp, EvidenceHomeSectionApp, SubNavbarApp });
