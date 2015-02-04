module Teacher
  extend ActiveSupport::Concern

  included do
    has_many :classrooms, foreign_key: 'teacher_id'
  end

  class << self
    delegate :first, :find, :where, :all, :count, to: :scope

    def scope
      User.where(role: 'teacher')
    end
  end

  # Occasionally teachers are populated in the view with
  # a single blank classroom.
  def has_classrooms?
    !classrooms.empty? && !classrooms.all?(&:new_record?)
  end
end
