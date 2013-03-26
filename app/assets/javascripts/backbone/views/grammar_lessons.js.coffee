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

