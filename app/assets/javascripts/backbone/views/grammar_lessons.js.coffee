class PG.Views.GrammarLessons extends Backbone.View
  events:
    'click .submit': 'showResults'

  showResults: ->
    _.each @$('.lesson'), (lessenEl) =>
      $lesson = $(lessenEl)
      rule = grammarRules.get($lesson.data('id'))

      if rule.correct().trim() == $lesson.find('.input').val().trim()
        $lesson.removeClass 'error'
        $lesson.addClass 'success'
      else
        $lesson.addClass 'error'

# This loops through each element listed 'lesson',
# compares the correct rule to the input value,
# and changes the element's class accordingly
