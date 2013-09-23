module Student
  extend ActiveSupport::Concern

  included do
    belongs_to :classroom, foreign_key: 'code', primary_key: 'code'
    has_many :assigned_chapters, through: :classroom, source: :chapters
    has_many :started_chapters, through: :scores, source: :chapter

    has_many :scores do
      def for_chapter chapter
        includes(:classroom_chapter).where(classroom_chapters: { chapter_id: chapter.id }).first
      end
    end
  end
end
