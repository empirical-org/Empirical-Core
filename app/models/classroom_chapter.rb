class ClassroomChapter < ActiveRecord::Base
  belongs_to :classroom
  belongs_to :chapter
  has_many :scores, dependent: :destroy
  default_scope includes(:chapter).order('chapters.title ASC')

  class << self
    def temporary chapter, options = {}
      classroom_chapter = new
      classroom_chapter.temporary = true
      classroom_chapter.chapter = chapter
      score = classroom_chapter.scores.build(user: options[:user])
      classroom_chapter.save!
      [classroom_chapter, score]
    end
  end
end
