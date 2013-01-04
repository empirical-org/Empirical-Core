class Question < ActiveRecord::Base
  attr_accessible :answer_keywords, :question_text, :lecture_chapter_id
  belongs_to :lecture_chapter, class_name: 'CMS::LectureChapter'

  def answer

  end
end
