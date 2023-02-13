import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import ReactOnRails from 'react-on-rails';
import PremiumPricingGuideApp from './PremiumPricingGuideAppClient.jsx';
import SubNavbarApp from './SubNavbarAppClient';

ReactOnRails.register({ PremiumPricingGuideApp, SubNavbarApp });
