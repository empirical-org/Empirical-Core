window.ruleQuestionPage = function ruleQuestionPage ($page) {
  $form = $page.find('form');
  $$ = $form.find.bind($form);
  $actions = $$('.chapter-test-question-actions');

  $form.find('.question-field textarea').focus();
  $form.find('.question-field textarea').bind("paste", function(e) {
    e.preventDefault();
  });

  function bypass () {
    $form.data('bypass', true);
  }

  function setStepClass (cls) {
    $actions
      .removeClass('default')
      .removeClass('first-try')
      .removeClass('second-try')
      .removeClass('correct')
      .addClass(cls);
  }

  function passed (step) {
    setStepClass('correct');
    bypass();
  }

  function failed (step) {
    setStepClass((step == 'first') ? 'first-try' : 'second-try');
    if (step == 'second') bypass();
  }

  function ProcessAjaxResponse (data) {
    return queue.AddMessageToQueue(data);
  }

  function verify (data) {
    if (data === null) return;

    if (data.first_grade === true || data.second_grade === null)
      $$('.js-input-step').val('second');

    if (data.first_grade  === true) return passed('first');
    if (data.second_grade === null) return failed('first');
    if (data.second_grade === true) return passed('second');
                                    return failed('second');
  }

  function checkAnswer (e) {
    if ($form.data('bypass'))
      return window.location = $actions.data('next-url');

    $.post('/verify_question', $form.serialize())
      .success(verify)
      .fail(function (err) {
        debugger;
      });
      $("body").removeLoadingButton();

    e.preventDefault();
  }

  function cheat () {
    $.post('/cheat', $form.serialize())
      .success(function (data) {
        $$('.question-field :input').val(data.answer);
        $$('.chapter-test-question-actions .btn:first').click();

        setTimeout(function () {
          $$('.chapter-test-question-actions .btn:first').click();
        }, 500);
      });
  }

  window.Cheater = cheat;

  $.get('/verify_question', $form.serialize()).success(verify);
  $page.on('click', '.btn.next', checkAnswer);
};
