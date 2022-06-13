
$(document).ready(function(){

  $('.activate-tooltip').tooltip({
	  	html: 'true',
	  	placement: 'auto top'
  });


  function tableSortIcons() {
    if ($('#classOne').hasClass('in')) {
      $('#test123').addClass('ph-caret-down')
    }

    else {
      $('#test123').addClass('ph-caret-up')
    }


    $('#activity-planner table thead .fa').hide();


    $('#activity-planner table thead th').on('click', function(){
      $(this).addClass('active');
    });

    $('#activity-planner table thead th').on('click', function(){
      $('.fa', this).toggleClass('fa-caret-up fa-caret-down');
    });

    if ($('#activity-planner table thead th').hasClass('active')) {
      $('.fa', this).show();
    }

    else {
      $('.fa', this).hide();
    }
  }

  tableSortIcons();
  $('.tabs-teacher-stories').tabslet({
    autorotate: true,
    delay: 10000,
    pauseonhover: true,
    animation: true,
    active: 1
  });

  $('.tabs-testimonials').tabslet({
    autorotate: true,
    delay: 10000,
    pauseonhover: false,
    animation: true,
    active: 1
  });

  $('#tooltip-test').tooltip({
    html: 'true'
  });


  // CMS
  $('.js-delete-link').on('ajax:success', function (e) {
    $(e.target).closest('tr').remove();
  });

});
