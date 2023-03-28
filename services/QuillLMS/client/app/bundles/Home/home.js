import $ from 'jquery';
import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

require('../../assets/styles/home.scss');
require('./bootstrap_carousel.js');
require('./tabslet.js')
require('../../assets/javascripts/clickHandlers');

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
