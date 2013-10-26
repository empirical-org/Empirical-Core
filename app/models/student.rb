module Student
  extend ActiveSupport::Concern

  included do
    has_one  :classroom, foreign_key: 'code', primary_key: 'classcode'
    has_one :teacher, through: :classroom
    has_many :assigned_chapters, through: :classroom, source: :chapters
    has_many :started_chapters, through: :scores, source: :chapter

    def completed_chapters classroom
      classroom_chapter_score_join(classroom).where('scores.completion_date is null')
    end

    def unfinished_chapters classroom
      classroom.chapters - completed_chapters(classroom)
    end

    def classroom_chapter_score_join classroom
      started_chapters.where(classroom_chapters: { classroom_id: classroom.id })
    end

    has_many :finished_chapters, -> { where('scores.state' => 'finished') }, through: :scores, source: :chapter do
      def for_classroom classroom
        includes(:classroom_chapters).where(classroom_chapters: { classroom_id: classroom.id }).first
      end
    end

    has_many :scores, dependent: :destroy do
      def for_chapter chapter
        includes(:classroom_chapter).where(classroom_chapters: { chapter_id: chapter.id }).first
      end
    end
  end
end
