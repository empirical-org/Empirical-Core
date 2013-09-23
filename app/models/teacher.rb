module Teacher
  extend ActiveSupport::Concern

  included do
    has_many :classrooms, foreign_key: 'teacher_id'
    has_many :teacher_chapters, through: :teacher_assignments, source: :chapter
    has_many :teacher_assignments, class_name: 'Assignment' do
      def for_chapter chapter
        where(chapter_id: chapter.id).first
      end
    end
  end

  class << self
    delegate :first, :find, :where, :all, :count, to: :scope

    def scope
      User.where(role: 'teacher')
    end
  end
end
