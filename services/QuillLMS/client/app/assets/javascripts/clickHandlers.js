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

$('.q-and-a-question-button').click(function () {
  const id = $(this).attr("id")
  const answerSection = $(`#q-and-a-answer-section-${id}`);
  if (answerSection.hasClass('show')) {
    answerSection.removeClass('show')
    answerSection.addClass('hide')
  } else {
    answerSection.removeClass('hide')
    answerSection.addClass('show')
  }
});

$('.q-and-a.expand-collapse-button').click(function () {
  const id = $(this).attr("id")
  const answerSection = $(`#q-and-a-answer-section-${id}`);
  const innerTextElement = $(this).children('p').eq(0)
  const innerImgElement = $(this).children('img').eq(0)
  const expandSrc = 'https://assets.quill.org/images/shared/expand.svg'
  const collapseSrc = 'https://assets.quill.org/images/shared/collapse.svg'

  if (answerSection.hasClass('show') && innerTextElement.length !== 0) {
    innerTextElement.text('Expand')
    answerSection.removeClass('show')
    answerSection.addClass('hide')
  } else if (answerSection.hasClass('show') && innerImgElement.length !== 0) {
    innerImgElement.attr('src', expandSrc)
    answerSection.removeClass('show')
    answerSection.addClass('hide')
  } else if (answerSection.hasClass('hide') && innerTextElement.length !== 0) {
    innerTextElement.text('Collapse')
    answerSection.removeClass('hide')
    answerSection.addClass('show')
  } else if (answerSection.hasClass('hide') && innerImgElement.length !== 0) {
    innerImgElement.attr('src', collapseSrc)
    answerSection.removeClass('hide')
    answerSection.addClass('show')
  }
});
