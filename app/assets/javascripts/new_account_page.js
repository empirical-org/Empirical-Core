$(function() {
  if (!$('.new-account-page')) {
    return;
  }

  var $radios = $('.js-role-select input[type=radio]')
    , $form = $radios.closest('form');

  $radios.on('click', function (e) {
    var $radio = $(e.target)
      , optionalText = ' (optional)';

    function makeOptional ($field) {
      var $input = $field.find('input');
      $input.attr('placeholder', $input.attr('placeholder') + optionalText);
      $input.prop('required', false);
    }

    function makeRequired ($field) {
      var $input = $field.find('input');
      $input.attr('placeholder', $input.attr('placeholder').split(optionalText).join(''));
      $input.prop('required', true);
    }

    if ($radio.val() == 'teacher') {
      makeRequired($form.find('.field.email'));
      $('.field.newsletter').show();
      $('.form-school-select').show();
    } else {
      makeOptional($form.find('.field.email'));
      $('.field.newsletter').hide();
      $('.form-school-select').hide();
    }
  }).filter(':checked').click();

  var schools = [];

  $('#user_school_ids').select2({
    allowClear: true,
    width: "400px",
    data: function() { return {results: schools}; },
    initSelection: function (element, callback) {
        var data = schools;
        callback(data);
    }
  });

  $("#user_school_ids").attr("placeholder", "Enter Your School's Zip Code");
  $("#user_school_ids").select2("val", "");
  $("#user_school_ids").select2("disable", true);

  $('#zipcode').on('keyup', function (e) {
    var zip = $(e.target).val();

    if (zip.length == 5) {
      $.get('/schools.json', {zipcode: zip })
        .done(function(data) {
          if (data.length > 0) {
            schools = data;
            $("#user_school_ids").attr("placeholder", "Select your school");
            $("#select2-chosen-1").html("Select your school");
            $('#user_school_ids').select2("enable", true);
            $("#user_school_ids").select2("open");
            $('#school_not_found').prop('checked', false);
          } else {
          $('#user_school_ids').select2("disable", true);
            schools = [{id: null, text: 'No schools found', disabled: true}]
            $("#user_school_ids").attr("placeholder", "No schools found");
            $("#select2-chosen-1").html("No schools found");
            $('#user_school_ids').select2("disable", true);
            $("#user_school_ids").select2("val", "");
            $('#school_not_found').prop('checked', true);
          }
        })
    }
  }).keyup();

  $('#school_not_found').on('click', function(e) {
    $('#zipcode').val("");
    $("#user_school_ids").attr("placeholder", "Enter your zipcode");
    $("#select2-chosen-1").html("Enter your zipcode");
    $('#user_school_ids').select2("disable", true);
    $('#user_school_ids').select2("val", "");
  }).filter(':checked').click();
});

