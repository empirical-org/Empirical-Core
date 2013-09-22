module Teacher
  extend ActiveSupport::Concern

  included do
    has_many :classrooms, foreign_key: 'teacher_id'
  end
end
