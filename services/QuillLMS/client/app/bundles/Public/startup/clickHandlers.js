import $ from 'jquery';

$('.cb.expand-collapse-button').click(function () {
  const id = $(this).attr("id")
  const topSection = $(`#college-board-toggle-top-section-${id}`);
  const bottomSection = $(`#college-board-toggle-bottom-section-${id}`);
  if(topSection.hasClass('closed')) {
    topSection.removeClass('closed')
    topSection.addClass('open')
    bottomSection.removeClass('hidden')
  } else {
    topSection.removeClass('open')
    topSection.addClass('closed')
    bottomSection.addClass('hidden')
  }
});
