$(document).ready ->
  if $('.panel.response').length > 0
    PGSite.init()

  $.fn.animateHighlight = (highlightColor, duration) ->
    highlightBg = highlightColor or "#FFFF9C"
    animateMs = duration or 1500
    originalBg = @css("backgroundColor")
    @stop().css("background-color", highlightBg).animate
      backgroundColor: originalBg
    , animateMs
