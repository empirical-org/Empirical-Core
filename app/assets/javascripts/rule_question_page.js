function ruleQuestionPage ($) {
  function checkAnswer (e) {
    $form = $(e.target);
    $$ = $form.find.bind($form);
    $actions = $$('.question-actions');

    if ($form.data('bypass'))
      return true;

    function bypass () {
      $form.data('bypass', true);
    }

    function message (cls, buttonTextKey, messageTextKey) {
      $$('.question-actions input').val($actions.data(buttonTextKey));
      $$('.verify-message')       .text($actions.data(messageTextKey))
        .addClass(cls)
        .removeClass((cls == 'error-message') ? 'success-message' : 'error-message');
    }

    function passed (step) {
      message('success-message', 'last-text', 'passed');
      bypass();
    }

    function failed (step) {
      var textKey        = (step == 'first') ? 'check-again' : 'last-text';
      var messageTextKey = (step == 'first') ? 'first-fail'  : 'second-fail';
      message('error-message', textKey, messageTextKey);
      $('.rule-question-page .step-one').addClass   ('hide');
      $('.rule-question-page .step-two').removeClass('hide');
      if (step == 'second') bypass();
    }

    function ProcessAjaxResponse (data) {
      return queue.AddMessageToQueue(data);
    }

    $.post('/verify_question', $form.serialize())
      .success(function (data) {
        if (data.first_grade  === true) return passed('first');
        if (data.second_grade === null) return failed('first');
        if (data.second_grade === true) return passed('second');
                                        return failed('second');
      })
      .fail(function (err) {
        debugger;
      });

    e.preventDefault();
  }

  $('.rule-question-page').on('submit', 'form', checkAnswer);
};
