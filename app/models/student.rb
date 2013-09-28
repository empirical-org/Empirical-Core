module Student
  extend ActiveSupport::Concern

  included do
    has_one  :classroom, foreign_key: 'code', primary_key: 'classcode'
    has_one :teacher, through: :classroom
    has_many :assigned_chapters, through: :classroom, source: :chapters
    has_many :started_chapters, through: :scores, source: :chapter

    has_many :scores, dependent: :destroy do
      def for_chapter chapter
        includes(:classroom_chapter).where(classroom_chapters: { chapter_id: chapter.id }).first
      end
    end
  end
end
