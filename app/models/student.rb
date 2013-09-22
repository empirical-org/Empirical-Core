module Student
  extend ActiveSupport::Concern

  included do
    has_one  :classroom, foreign_key: 'classcode', primary_key: 'classcode'
    has_many :scores
  end
end