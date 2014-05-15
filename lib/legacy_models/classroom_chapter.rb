class ClassroomChapter < ActiveRecord::Base
  belongs_to :classroom
  belongs_to :chapter
  has_many :scores, dependent: :destroy
  default_scope -> { includes(:chapter).order('chapters.title ASC') }

  def due_date_string= val
    self.due_date = Date.strptime(val, '%m/%d/%Y')
  end

  def due_date_string
    due_date.try(:strftime, '%m/%d/%Y')
  end

  class << self
    def temporary_score chapter, options = {}
      classroom_chapter = new
      classroom_chapter.temporary = true
      classroom_chapter.chapter = chapter
      score = classroom_chapter.scores.build(user: options[:user])
      classroom_chapter.save!
      score
    end

    def create_score chapter, options = {}
      classroom_chapter = where(chapter_id: chapter.id, classroom_id: options[:user].classroom.id).first
      classroom_chapter.scores.create!(user: options[:user])
    end
  end
end
