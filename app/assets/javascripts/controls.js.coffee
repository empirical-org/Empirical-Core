jQuery ($) ->
  $('.primary-control a').on 'click', (e) ->
    e.preventDefault()
    @parent = $(e.target).parent()
    $('.panel').hide()

    if      @parent.hasClass('graph')        then $('.panel.primary').show()
    else if @parent.hasClass('textbook')     then $('.panel.response').show()
    else if @parent.hasClass('conversation') then $('.panel.conversation').show()
    else                                          $('.panel.placeholder').show()

    $('.primary-control').removeClass('active')
    @parent.addClass('active')

  $('.text-area-control li:not(.nextpage) a').on 'click', (e) ->
    e.preventDefault()
