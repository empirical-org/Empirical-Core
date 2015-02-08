
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


		$("#activity-planner table thead .fa").hide();


		$("#activity-planner table thead th").on('click', function(){
			$(this).addClass("active");
		});

		$("#activity-planner table thead th").on('click', function(){
			$(".fa", this).toggleClass("fa-caret-up fa-caret-down");
		});

		if ($("#activity-planner table thead th").hasClass("active")) {
			$(".fa", this).show();
		}

		else {
			$(".fa", this).hide();
		}
	}

	tableSortIcons();

	//Datepicker

	$(function() {
	    $( "#datepicker1" ).datepicker({
      		selectOtherMonths: true,
      		dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      		minDate: -20,
      		maxDate: "+1M +10D" 
	    });

	    $( "#datepicker2" ).datepicker({
      		selectOtherMonths: true,
      		dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      		minDate: -20,
      		maxDate: "+1M +10D" 
	    });

	    $( "#datepicker3" ).datepicker({
      		selectOtherMonths: true,
      		dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      		minDate: -20,
      		maxDate: "+1M +10D" 
	    });

	    $( "#datepicker4" ).datepicker({
      		selectOtherMonths: true,
      		dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      		minDate: -20,
      		maxDate: "+1M +10D",
      		showOptions: { direction: "left" }
	    });

	    $( "#datepicker5" ).datepicker({
      		selectOtherMonths: true,
      		dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      		minDate: -20,
      		maxDate: "+1M +10D" 
	    });
  	});

	//Selects

	//Grade-select

	$( '#grade-select' ).selecter({
		customClass: "grade-select"
	});


	$( '#home-slider' ).slick({
		dots: true,
		arrows: false,
		fade: true,
		pauseOnHover: false,
		cssEase: 'linear',
		speed: 300,
		autoplay: true,
		autoplaySpeed: 12000
	});


	$( '#home-slider' ).on('afterChange', function(event, slick, currentSlide, nextSlide) {
		var n = $('.home-page-navbar');
		var h = $('.home-hero');

		if (currentSlide == 0) {
			n.addClass('proofreader-navbar');
			h.removeClass('writer-outer');
			n.removeClass('writer-navbar');
			n.removeClass('dashboard-navbar');
			h.removeClass('dashboard-outer');
		}

		else if (currentSlide == 1) {
			n.addClass('writer-navbar');
			h.addClass('writer-outer');
			n.removeClass('dashboard-navbar');
			h.removeClass('dashboard-outer');
		}

		else if (currentSlide == 2) {
			n.addClass('dashboard-navbar');
			h.addClass('dashboard-outer');
			n.removeClass('writer-navbar');
			h.removeClass('writer-outer');
		}
	});

	$('.tabs-testimonials').tabslet({
		autorotate: true,
		delay: 10000,
		pauseonhover: false,
		animation: true,
		active: 1
	});

});



$('#tooltip-test').tooltip({
	html: 'true'
});

	

