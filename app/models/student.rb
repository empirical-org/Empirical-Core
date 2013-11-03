module Student
  extend ActiveSupport::Concern

  included do
    has_one  :classroom, foreign_key: 'code', primary_key: 'classcode'
    has_one :teacher, through: :classroom
    has_many :assigned_chapters, through: :classroom, source: :chapters
    has_many :started_chapters, through: :scores, source: :chapter

    def unfinished_chapters classroom
      classroom.chapters - finished_chapters(classroom)
    end

    def finished_chapters classroom
      classroom_chapter_score_join(classroom).where('scores.completion_date is not null')
    end

    def classroom_chapter_score_join classroom
      started_chapters.where(classroom_chapters: { classroom_id: classroom.id })
    end
    protected :classroom_chapter_score_join

    # has_many :finished_chapters, -> { where('scores.state' => 'finished') }, through: :scores, source: :chapter do
    #   def for_classroom classroom
    #     includes(:classroom_chapters).where(classroom_chapters: { classroom_id: classroom.id }).first
    #   end
    # end

    has_many :scores, dependent: :destroy do
      def for_chapter chapter
        includes(:classroom_chapter).where(classroom_chapters: { chapter_id: chapter.id }).last
      end
    end
  end
end
