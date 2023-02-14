import ReactOnRails from 'react-on-rails';
import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

import EvidenceToolApp from './evidenceToolAppClient'
import EvidenceHomeSectionApp from './evidenceHomeSectionAppClient'

require('../../../assets/styles/home.scss');
require('../../Home/bootstrap_carousel.js');

ReactOnRails.register({ EvidenceToolApp, EvidenceHomeSectionApp });
