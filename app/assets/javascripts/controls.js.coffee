$ ->
  $('.primary-control a').on 'click', (e) ->
    e.preventDefault()
    @parent = $(e.target).parent()
    $('.panel').hide()
    if @parent.hasClass('graph')
      $('.panel.primary').show()
    else if @parent.hasClass('textbook')
      $('.panel.response').show()
    else if @parent.hasClass('conversation')
      $('.panel.conversation').show()
    else
      $('.panel.placeholder').show()

    $('.primary-control').removeClass('active')
    @parent.addClass('active')

  $('.text-area-control a').on 'click', (e) ->
    e.preventDefault()
