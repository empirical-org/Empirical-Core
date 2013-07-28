class PG.Views.ChapterLessons extends Backbone.View
  events:
    'click .submit': 'showResults'
    'click .home': 'goHome'

  initialize: (options) ->
    $('.incorrect').hide()
    $('.home').hide()
    chapterScore.setMissed(options.percentMissed)


  showResults: ->
    _.each @$('.lesson'), (lessenEl) =>
      $lesson = $(lessenEl)
      thisLesson = chapterLessons.get($lesson.data('id'))

      if thisLesson.correct $lesson.find('.input').val()
        $lesson.removeClass 'error'
        $lesson.addClass 'success'
      else
        $lesson.addClass 'error'
        $lesson.find('.form').hide()
        $lesson.find('.incorrect').show()

    $('.submit').hide()
    percentCompleted = $('.lesson.success').length / $('.lesson').length * 100
    chapterScore.setCompleted(percentCompleted)

    chapterScore.save({
      user_id: chapterScore.user_id,
      assignment_id: chapterScore.assignment_id,
      items_missed: chapterScore.items_missed,
      lessons_completed: chapterScore.lessons_completed
    }, {
    error:   -> console.log("Error")
    success: -> $('.home').show()
    })

  goHome: ->
    document.location.href = '/profile'
