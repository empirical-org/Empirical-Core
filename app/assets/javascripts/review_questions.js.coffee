class ReviewQuestion extends Backbone.View
  events:
    'submit form': 'showResult'

  showResult: (e) ->
    e.preventDefault()
    answer = @$('textarea').val()

    for option in @$el.data('answer_keywords').split(/\s+/)
      if answer.match option
        return @message('success', 'That\'s correct')

    @message 'error', 'Sorry, please try again.'

  message: (type, message) ->
    @$('.message').html('')

    @$('.message').append """
      <div class="#{type}">
        #{message}
      </div>
    """

    true

jQuery ($) ->
  if (reviewQuestions = $('.review-question')).length > 0
    new ReviewQuestion({el}) for el in reviewQuestions
