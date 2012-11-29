google.load "earth", "1"
init = ->
  google.earth.createInstance "google-earth", initCB, failureCB
initCB = (instance) ->
  ge = instance
  ge.getWindow().setVisibility true
failureCB = (errorCode) ->

google.setOnLoadCallback init
