$ ->
  smartToggle = (panel) ->
    $('.panel').addClass('minimized')
    panel.removeClass('minimized')
    if ($('.panel.minimized:visible').length > 0)
      $('.panel.minimized:visible').slideToggle ->
        panel.slideToggle()
    else
      panel.slideToggle()

  $('.controls a').on 'click', (e) ->
    e.preventDefault()
    if $(e.target).hasClass('tool-control')
      panel = $('.tools-panel')
    else if $(e.target).hasClass('panel-control')
      panel = $(e.target.parentElement).next('.panel')
    smartToggle(panel) if panel?
