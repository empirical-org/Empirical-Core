import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import ReactOnRails from 'react-on-rails';

import DemoAccountBanner from './demoAccountBannerApp';
import PremiumPricingGuideApp from './premiumPricingGuideApp';

import PremiumFooterApp from '../../Footer/startup/PremiumFooterAppClient.jsx';
import '../../../assets/javascripts/clickHandlers.js';
import '../../../assets/styles/home.scss';
import '../../Home/startup/bootstrap_carousel.js';

ReactOnRails.register({ PremiumPricingGuideApp, DemoAccountBanner, PremiumFooterApp });
