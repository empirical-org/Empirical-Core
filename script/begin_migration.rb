# restore chapter levels
ChapterLevel.delete_all
Section.all.each do |section|
  chapter_level = ChapterLevel.new
  chapter_level.id          = section.id
  chapter_level.name        = section.name
  chapter_level.position    = section.position
  chapter_level.created_at  = section.created_at
  chapter_level.updated_at  = section.updated_at
  chapter_level.workbook_id = section.workbook_id
  chapter_level.save!
end

Topic.destroy_all
ActivityClassification.destroy_all
Activity.destroy_all
RuleQuestionInput.includes(:rule_question).where('rule_questions.id is null').map(&:destroy)
Chapter.find_by_id(55).try(:destroy)

story_class = ActivityClassification.create!(
  name: 'Story',
  key: 'story',
  module_url: 'http://quill-questions-module.herokuapp.com/stories/module',
  form_url:   'http://quill-questions-module.herokuapp.com/stories/form'
)

practice_class = ActivityClassification.create!(
  name: 'Practice Questions',
  key: 'practice_question_set',
  module_url: 'http://quill-questions-module.herokuapp.com/practice_questions/module',
  form_url:   'http://quill-questions-module.herokuapp.com/practice_questions/form'
)

app = Doorkeeper::Application.find_by_uid('quill-lessons') || Doorkeeper::Application.new
app.attributes = {
  name:   'Quill Lessons Module',
  uid:    'quill-lessons',
  secret: 'quill-lessons-non-secret',
  redirect_uri: 'http://quill-questions-module.herokuapp.com/'
}
