import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import ReactOnRails from 'react-on-rails';

import PremiumPricingGuideApp from './premiumPricingGuideApp';
import DemoAccountBanner from './demoAccountBannerApp'

require('../../../assets/styles/home.scss');
require('../../Home/bootstrap_carousel.js');
require('../../../assets/javascripts/clickHandlers.js');

ReactOnRails.register({ PremiumPricingGuideApp, DemoAccountBanner });
