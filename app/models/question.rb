class Question < ActiveRecord::Base
  belongs_to :lecture_chapter, class_name: 'CMS::LectureChapter'

  def answer

  end
end
