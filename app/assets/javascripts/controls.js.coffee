jQuery ($) ->
  $('.control a').on 'click', (e) ->
    e.preventDefault()
    @parent = $(e.target).parent()
    $('.panel').hide()

    if      @parent.hasClass('chart')        then $('.panel.primary').show()
    else if @parent.hasClass('questions')     then $('.panel.response').show()
    else if @parent.hasClass('discussion') then $('.panel.conversation').show()
    else if @parent.hasClass('annotate') then $('.panel.text-area').show()
    else                                          $('.panel.placeholder').show()

  $('.control:not(.next) a').on 'click', (e) ->
    e.preventDefault()
    $('.control a').removeClass('active')
    $(e.target).addClass('active')
