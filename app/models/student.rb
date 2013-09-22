module Student
  extend ActiveSupport::Concern

  included do
    belongs_to :classroom, foreign_key: 'code', primary_key: 'code'
    has_many :scores

    has_many :assigned_chapters,           through: :classroom, source: :chapters
    has_many :assigned_classroom_chapters, through: :classroom, source: :classroom_chapters do
      def for_chapter chapter
        where(chapter_id: chapter.id).first
      end
    end
  end
end
