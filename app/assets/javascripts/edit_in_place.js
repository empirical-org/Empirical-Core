jQuery(function ($) {
  $('.form-with-edit-in-place').each(function () {
    var $form = $(this);

    $form
      .on('ajax:error', displayErrorMessage)

    .find('.edit-in-place')
      .on('click', 'span', openEditInPlaceFromDisplay)
      .on('keyup', 'input', detectEnterPress)
      .on('click', 'a[data-toggle]', toggleEditInPlaceFromLink);

    function toggleEditInPlaceFromLink (e) {
      var $el = $(e.target)
        , $edit = $el.closest('.edit-in-place');

      e.preventDefault();

      if ($edit.hasClass('open')) {
        $el.text($el.text().replace('Save', 'Edit'));
        saveEditInPlace($edit.find('input'), $edit);
      } else {
        $el.text($el.text().replace('Edit', 'Save'));
        openEditInPlace($edit);
      }
    }

    function openEditInPlaceFromDisplay (e) {
      var $el = $(e.target)
        , $edit = $el.closest('.edit-in-place');

      openEditInPlace($edit);
    }

    function openEditInPlace($edit) {
      $edit
        .addClass('open')
        .find('input').focus();
    }

    function detectEnterPress (e) {
      var $el = $(e.target)
        , $edit = $el.closest('.edit-in-place')
        , code = e.keyCode || e.which;

      if (code == 13) saveEditInPlace($el, $edit);
    }

    // function saveEditInPlaceFromBlur (e) {
    //   var $el = $(e.target)
    //     , $edit = $el.closest('.edit-in-place');

    //   saveEditInPlace($el, $edit);
    // }

    function saveEditInPlace ($el, $edit) {
      $form.submit();
      $edit.removeClass('open');
      $edit.find('span').text($el.val());
    }

    function displayErrorMessage (e, xhr) {
      alert(xhr.responseText);
    }
  });
});
