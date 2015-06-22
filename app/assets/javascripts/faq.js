(function($) {
  $(document).ready( function() {
    if (!$('.pages-faq').length) {
      return;
    }

    $('a.accordion-toggle').click( function(e) { 
      e.preventDefault(); 
      $(this).next('.accordion-body').collapse('toggle');
    }); 
    if(window.location.hash) { 
      $(window.location.hash+' .accordion-body').collapse('toggle'); 
    }
  });
})(jQuery);