class QuestionSet < ApplicationRecord
  belongs_to :activity
  has_many :questions
end
