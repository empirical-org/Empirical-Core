class PG.Views.ChapterLessons extends Backbone.View
  events:
    'click .submit': 'showResults'

  showResults: ->
    _.each @$('.lesson'), (lessenEl) =>
      $lesson = $(lessenEl)
      thisLesson = chapterLessons.get($lesson.data('id'))

      if thisLesson.correct().trim() == $lesson.find('.input').val().trim()
        $lesson.removeClass 'error'
        $lesson.addClass 'success'
      else
        $lesson.addClass 'error'