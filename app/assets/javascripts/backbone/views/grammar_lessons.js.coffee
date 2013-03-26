class PG.Views.GrammarLessons extends Backbone.View
  events:
    'click .submit': 'showResults'

  showResults: ->
    _.each @$('.lesson'), (lessenEl) =>
      $lesson = $(lessenEl)
      rule = grammarRules.get($lesson.data('id'))

      if rule.correct().trim() == $lesson.find('.input').val().trim()
        alert 'correct'
      else
        alert 'incorrect'

