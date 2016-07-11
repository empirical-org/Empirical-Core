





$(document).ready(function () {
	if (!$('#home-slider').length) {
		return;
	}

	$( '#home-slider' ).slick({
		dots: true,
		arrows: false,
		fade: true,
		pauseOnHover: false,
		cssEase: 'linear',
		speed: 10,
		autoplay: true,
		autoplaySpeed: 13440
	});






	$( '#home-slider' ).on('beforeChange', function(event, slick, currentSlide, nextSlide) {
		var nav = $('.home-page-navbar');
		var hero = $('.home-hero');


		if (nextSlide == 0) {

			nav.removeClass('writer-navbar');
			nav.removeClass('dashboard-navbar');
			nav.addClass('proofreader-navbar');

			hero.addClass('proofreader-outer')
			hero.removeClass('writer-outer');
			hero.removeClass('dashboard-outer');




		}

		else if (nextSlide == 1) {
			nav.removeClass('dashboard-navbar');
			nav.removeClass('proofreader-navbar');
			nav.addClass('writer-navbar');

			hero.removeClass('dashboard-outer');
			hero.addClass('writer-outer');
		}

		else if (nextSlide == 2) {
			nav.removeClass('writer-navbar');
			nav.removeClass('proofreader-navbar');

			nav.addClass('dashboard-navbar');

			hero.removeClass('writer-outer');
			hero.addClass('dashboard-outer');
		}
	});

});
