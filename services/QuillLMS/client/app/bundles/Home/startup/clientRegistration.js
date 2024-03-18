import $ from 'jquery';
import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import ReactOnRails from 'react-on-rails';

import PremiumFooterApp from '../../Teacher/startup/PremiumFooterAppClient.jsx';
import '../../../assets/javascripts/clickHandlers';
import '../../../assets/styles/home.scss';
import './bootstrap_carousel.js';
import './tabslet.js';


ReactOnRails.register({PremiumFooterApp});

document.onreadystatechange = () => {
  const state = document.readyState;
  if (state === 'complete') {
    $('tabs-teacher-stories').tabslet({
      autorotate: true,
      delay: 10000,
      pauseonhover: true,
      animation: true,
      active: 1,
    });

    $('.tabs-testimonials').tabslet({
      autorotate: true,
      delay: 10000,
      pauseonhover: false,
      animation: true,
      active: 1,
    });
  }
};
