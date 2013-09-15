class window.ConceptReviewRoot extends Backbone.View
  events:
    'click .display': 'showEdit'
    'click .save'   : 'save'
    'click .add'    : 'addPosition'
    'click .remove' : 'removeAnswer'

  field_name: 'concept_position'

  initialize: () ->
    vals = JSON.parse(@$('.hidden input').val())
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
          <textarea id="chapter_concept_position" name="#{@field_name}[]" size="30" type="text" value=""></textarea>
          <a href="#remove" class="remove">Remove</a>
        </div>
      </div>
    """).find('textarea').val(val).end()

  conceptOrderString: ->
    JSON.stringify(
      _.map(@$('.concept-position textarea'), (el) -> $(el).val())
    )

  removeAnswer: (e) ->
    $(e.target).closest('.concept-position').remove()

class window.LessonAnswerRoot extends ConceptReviewRoot
  initialize: ->
    super JSON.parse(@$('.hidden input').val())
    _.bindAll 'save'

    @$el.closest('form').find('.form-actions .btn').on 'click', =>
      @save()
      @$('textarea[name="lesson[answer_array_json]"]').remove()

  field_name: 'answer_options'

dataLoad = (cla) ->
  new window[cla] {el} for el in $("""*[data-view="#{cla}"]""")

loadSeriesRoots = ->
  dataLoad 'ConceptReviewRoot'
  dataLoad 'LessonAnswerRoot'
  dataLoad 'RuleExamplesRoot'

jQuery(document).on 'page:load', loadSeriesRoots
jQuery loadSeriesRoots