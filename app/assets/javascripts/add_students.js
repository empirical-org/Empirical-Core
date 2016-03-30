//Hacky fix until this page is done in React --
// without this, the Add Student Button can easily be double triggered.
$( document ).ready(function() {
  buttonBlocker('.ajax-button');
});


var buttonBlocker = function(blockedButton) {
  $(blockedButton).click(function() {
    var that = this;
    //if we set disabled right away, it doesn't have time to submit the form.
    setTimeout(function() {
      $(that).attr("disabled", true);
    }, 75);
    setTimeout(function() {
      $('that').attr("disabled", false);
    }, 500);
  });
};

buttonBlocker('.ajax-button');
