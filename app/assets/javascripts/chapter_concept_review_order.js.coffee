class window.ConceptReviewRoot extends Backbone.View
  events:
    'click .display': 'showEdit'
    'click .save'   : 'save'
    'click .add'    : 'addPosition'

  field_name: 'concept_position'

  initialize: (vals = @$('.hidden input').val().split(",")) ->
    if _.isEmpty(vals) then vals = [" "]
    for val in vals
      @$('.edit .positions').append @positionTemplate(val.trim())
    @$('.display').html @$('.hidden input').val()

  showEdit: ->
    @$('.display').hide()
    @$('.edit')   .show()

  save: ->
    @$('.display').show()
    @$('.edit')   .hide()
    @$('.hidden input').val @conceptOrderString()
    @$('.display').html     @conceptOrderString()

  addPosition: ->
    @$('.edit .positions').append @positionTemplate()

  positionTemplate: (val="") ->
    $("""
      <div class="field string concept-position control-group">
        <div class="controls">
          <input id="chapter_concept_position" name="#{@field_name}[]" size="30" type="text" value="">
        </div>
      </div>
    """).find('input').val(val).end()

  conceptOrderString: ->
    _.map(@$('.concept-position input'), (el) -> $(el).val()).join(", ")

class window.LessonAnswerRoot extends ConceptReviewRoot
  initialize: ->
    super JSON.parse(@$('.hidden input').val())
    _.bindAll 'save'
    @$el.closest('form').find('.form-actions .btn').on 'click', =>
      @save()
      @$('input[name="lesson[answer_array_json] "]').remove()

  field_name: 'answer_options'


dataLoad = (cla) ->
  new window[cla] {el} for el in $("""*[data-view="#{cla}"]""")

jQuery ($) ->
  dataLoad 'ConceptReviewRoot'
  dataLoad 'LessonAnswerRoot'