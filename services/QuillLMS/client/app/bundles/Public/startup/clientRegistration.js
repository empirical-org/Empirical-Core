import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import ReactOnRails from 'react-on-rails';

import DemoAccountBanner from './demoAccountBannerApp';
import PremiumPricingGuideApp from './premiumPricingGuideApp';

require('../../../assets/styles/home.scss');
require('../../Home/bootstrap_carousel.js');
require('../../../assets/javascripts/clickHandlers.js');

ReactOnRails.register({ PremiumPricingGuideApp, DemoAccountBanner });
