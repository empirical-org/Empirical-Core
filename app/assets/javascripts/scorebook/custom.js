$(document).ready(function(){

  //1st tab

  $("#classroom-select").selectbox({
    classToggle: "fa fa-caret-down",
    classHolder: "select-mixin select-custom-mixin select-white",
    classSelector: "select-box-trigger"
  });

  $("#units-select").selectbox({
    classToggle: "fa fa-caret-down",
    classHolder: "select-mixin select-custom-mixin select-gray",
    classOptions: "select-white",
    classSelector: "select-box-trigger",
    classDisabled: "select-box-disabled",
    classHolderDisabled: "select-gray"
  });


  //2nd tab

  $("#classroom-select-2").selectbox({
    classToggle: "fa fa-caret-down",
    classHolder: "select-mixin select-custom-mixin select-white",
    classSelector: "select-box-trigger"
  });

  $("#units-select-2").selectbox({
    classToggle: "fa fa-caret-down",
    classHolder: "select-mixin select-custom-mixin select-gray",
    classOptions: "select-white",
    classSelector: "select-box-trigger",
    classDisabled: "select-box-disabled",
    classHolderDisabled: "select-gray"
  });



  //Activity Planner tab

  $("#sort-by-app").selectbox({
    classToggle: "fa fa-caret-down",
    classHolder: "select-mixin select-custom-mixin select-gray activity-planner-select",
    classOptions: "select-white",
    classSelector: "select-box-trigger",
    classDisabled: "select-box-disabled",
    classHolderDisabled: "select-gray",
    effect: "fade"
  });

  $("#sort-by-level").selectbox({
    classToggle: "fa fa-caret-down",
    classHolder: "select-mixin select-custom-mixin select-gray activity-planner-select",
    classOptions: "select-white",
    classSelector: "select-box-trigger",
    classDisabled: "select-box-disabled",
    classHolderDisabled: "select-gray",
    effect: "fade"
  });

  $("#sort-by-concept").selectbox({
    classToggle: "fa fa-caret-down",
    classHolder: "select-mixin select-custom-mixin select-gray activity-planner-select",
    classOptions: "select-white",
    classSelector: "select-box-trigger",
    classDisabled: "select-box-disabled",
    classHolderDisabled: "select-gray",
    effect: "fade"
  });



  //4th tab

  $("#classroom-select-4").selectbox({
    classToggle: "fa fa-caret-down",
    classHolder: "select-mixin select-custom-mixin select-white",
    classSelector: "select-box-trigger"
  });

  $("#units-select-4").selectbox({
    classToggle: "fa fa-caret-down",
    classHolder: "select-mixin select-custom-mixin select-gray",
    classOptions: "select-white",
    classSelector: "select-box-trigger",
    classDisabled: "select-box-disabled",
    classHolderDisabled: "select-gray"
  });

});



$("#units-select").selectbox("enable")

$('#tooltip-test').tooltip({
  html: 'true'
  }
);


