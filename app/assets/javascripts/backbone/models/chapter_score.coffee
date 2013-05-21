class PG.Models.ChapterScore extends Backbone.Model
  initialize: (options) ->
    @user_id = options.user_id
    @assignment_id = options.assignment_id
    @items_missed = 0
    @lessons_completed = 0

  setMissed: (itemsMissed) ->
    @items_missed = itemsMissed

  setCompleted: (lessonsCompleted) ->
    @lessons_completed = lessonsCompleted

  url: "/score"



