class HomeSlideshow extends Backbone.View
  initialize: ->
    _.bindAll this, 'next'
    @interval = setInterval @next, 5000

  next: ->
    $active = @$('.content.active')
    index = @$('.content').index($active)
    $('.content').removeClass('disabled')

    $next = if @$('.content').length == index + 1
      @$('.content:eq(0)')
    else
      @$(".content:eq(#{index + 1})")

    $active.removeClass 'active'
    $next.addClass('active')
    setTimeout (-> $next.siblings().addClass('disabled')), 500

jQuery ($) ->
  if (el = $('#apDiv5')).length > 0 then new HomeSlideshow {el}

  $('.nav').on 'click', 'li.dropdown.open > a', (e) ->
    window.location = $(e.target).closest('li').find('ul a:first').prop('href')
